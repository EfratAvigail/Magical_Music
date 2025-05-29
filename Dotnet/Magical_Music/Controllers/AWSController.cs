using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.IO;
using System.Linq;
using Magical_Music.SERVICE;
using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Services;
using Microsoft.Extensions.Configuration;
using System;

namespace Magical_Music.API.Controllers
{
    [Route("api/UploadFile")]
    [ApiController]
    public class AWSController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly AWSService _awsService;

        public AWSController(IAmazonS3 s3Client, IConfiguration configuration, AWSService awsService)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"];
            _awsService = awsService;
        }

        [HttpGet("presigned-url")]
        public IActionResult GetPresignedUrl([FromQuery] string fileName, [FromQuery] string albumName)
        {
            if (string.IsNullOrEmpty(fileName) || string.IsNullOrEmpty(albumName))
                return BadRequest("חובה לציין שם קובץ ואלבום.");

            var ext = Path.GetExtension(fileName).ToLower();
            var contentType = ext switch
            {
                ".mp3" => "audio/mpeg",
                ".wav" => "audio/wav",
                ".ogg" => "audio/ogg",
                _ => null
            };

            if (contentType == null)
                return BadRequest("רק קבצי MP3, WAV או OGG מותרים.");

            var url = _awsService.GeneratePresignedUploadUrl($"{albumName}/{fileName}", contentType);
            var fileUrl = $"https://{_bucketName}.s3.amazonaws.com/{albumName}/{fileName}";

            return Ok(new { uploadUrl = url, fileUrl });
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadFile([FromForm] CORE.Models.UploadSongRequest request, [FromServices] ISongService songService)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("File is empty.");

            var allowedExtensions = new[] { ".mp3", ".wav" };
            var fileExtension = Path.GetExtension(request.File.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
                return BadRequest("רק קבצי MP3 או WAV מותרים.");

            using var stream = request.File.OpenReadStream();

            // העלאת הקובץ ל-S3
            var (url, key) = await _awsService.UploadFileAsync(stream, request.File.FileName);

            // יצירת אובייקט SongDTO
            var songDto = new SongDTO
            {
                Name = request.Name,
                MusicStyle = request.MusicStyle,
                SongLength = request.SongLength,
                ReleaseDate = request.ReleaseDate,
                ImageUrl = request.ImageUrl,
                S3Url = url,  // ודא שה-URL נשמר נכון
                Key = key
            };

            // הוספת השיר למסד הנתונים
            var savedSong = await songService.AddAsync(songDto);

            return Ok(new { Song = savedSong, S3Url = url });
        }



        //[HttpGet("download-url")]
        //public IActionResult GetDownloadUrl([FromQuery] string fileName)
        //{
        //    if (string.IsNullOrWhiteSpace(fileName))
        //        return BadRequest("שם הקובץ חסר.");

        //    try
        //    {
        //        var url = _awsService.GeneratePresignedDownloadUrl(fileName);
        //        return Ok(new { downloadUrl = url });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"שגיאה בהפקת קישור הורדה: {ex.Message}");
        //    }
        //}
        [HttpGet("download-url")]
        public async Task<IActionResult> GetDownloadUrl([FromQuery] string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return BadRequest("שם הקובץ לא יכול להיות ריק.");
            }

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(30)
            };

            try
            {
                string url = _s3Client.GetPreSignedURL(request);
                return Ok(new { fileUrl = url });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"שגיאה ביצירת URL להורדה: {ex.Message}");
            }
        }

        [HttpGet("songs")]
        public async Task<IActionResult> GetAllSongsAsync()
        {
            try
            {
                var songs = await _awsService.GetAllSongsAsync();
                return Ok(songs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה בשליפת השירים: {ex.Message}");
            }
        }
    }
}
