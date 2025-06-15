using Amazon.S3;
using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Services;
using Microsoft.Extensions.Configuration;
using System.Diagnostics;

namespace Magical_Music.SERVICE
{
    public class SongCuttingService : ISongCuttingService
    {
        private readonly IAmazonS3 _s3;
        private readonly IConfiguration _config;

        public SongCuttingService(IAmazonS3 s3, IConfiguration config)
        {
            _s3 = s3;
            _config = config;
        }

        public async Task<string> CutSongAsync(SongCutRequest request)
        {
            var bucket = _config["AWS:BucketName"];
            var tempInput = Path.GetTempFileName() + ".mp3";

            // שם חדש לקובץ החתוך
            var cutFileName = $"cut_{Path.GetFileNameWithoutExtension(request.SongKey)}_{DateTime.Now:yyyyMMddHHmmss}.mp3";
            var tempOutput = Path.Combine(Path.GetTempPath(), cutFileName);

            // הורדה מ־S3
            var response = await _s3.GetObjectAsync(bucket, request.SongKey);
            using (var fileStream = File.Create(tempInput))
            {
                await response.ResponseStream.CopyToAsync(fileStream);
            }

            // נתיב ל־ffmpeg ב־Linux
            var ffmpegPath = "/usr/bin/ffmpeg";
            if (!File.Exists(ffmpegPath))
                throw new FileNotFoundException("ffmpeg not found", ffmpegPath);

            // חישוב זמנים
            var start = request.StartSeconds;
            var duration = request.EndSeconds - request.StartSeconds;

            // בניית פקודה
            var ffmpegArgs = $"-i \"{tempInput}\" -ss {start} -t {duration} -c copy \"{tempOutput}\"";

            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = ffmpegPath,
                    Arguments = ffmpegArgs,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            process.Start();
            string stderr = await process.StandardError.ReadToEndAsync(); // לקרוא לוגים אם יש שגיאה
            await process.WaitForExitAsync();

            if (process.ExitCode != 0)
                throw new Exception($"FFmpeg failed to cut the song. Error: {stderr}");

            // מחיקת הקלט
            File.Delete(tempInput);

            // החזרת הנתיב לקובץ החתוך
            return tempOutput;
        }
    }
}
