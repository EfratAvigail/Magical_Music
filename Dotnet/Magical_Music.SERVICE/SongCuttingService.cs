using Amazon.S3;
using Amazon.S3.Transfer;
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

            // נתיב ל־ffmpeg.exe
            var ffmpegPath = Path.Combine(Directory.GetCurrentDirectory(), "Tools", "ffmpeg", "ffmpeg.exe");
            if (!File.Exists(ffmpegPath))
                throw new FileNotFoundException("ffmpeg.exe not found", ffmpegPath);

            // חיתוך עם FFmpeg
            var start = request.StartSeconds;
            var duration = request.EndSeconds - request.StartSeconds;
            var ffmpegArgs = $"-i \"{tempInput}\" -ss {start} -t {duration} -c copy \"{tempOutput}\"";

            var process = Process.Start(new ProcessStartInfo
            {
                FileName = ffmpegPath,
                Arguments = ffmpegArgs,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            });

            await process.WaitForExitAsync();
            if (process.ExitCode != 0)
                throw new Exception("FFmpeg failed to cut the song.");

            // מחיקת הקלט בלבד
            File.Delete(tempInput);

            // החזרת נתיב לפלט (העתק חתוך)
            return tempOutput;
        }
    }
}
