using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using Magical_Music.SERVICE;
using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Models;
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
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName, [FromQuery] string albumName)
        {
            if (string.IsNullOrEmpty(fileName) || string.IsNullOrEmpty(albumName))
            {
                fileName = "file";
                albumName = "default-album"; // החלף בשם ברירת המחדל שתרצה
            }

            string fileExtension = Path.GetExtension(fileName).ToLower();
            string contentType;

            switch (fileExtension)
            {
                case ".mp3":
                    contentType = "audio/mpeg";
                    break;
                case ".wav":
                    contentType = "audio/wav";
                    break;
                case ".ogg":
                    contentType = "audio/ogg";
                    break;
                default:
                    return BadRequest("סוג הקובץ לא נתמך. רק קבצי אודיו מותר להעלות.");
            }

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = $"{albumName}/{fileName}",
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(10),
                ContentType = contentType
            };

            request.Headers["x-amz-acl"] = "bucket-owner-full-control";

            try
            {
                string url = _s3Client.GetPreSignedURL(request);
                string fileUrl = $"https://{_bucketName}.s3.ca-central-1.amazonaws.com/{albumName}/{fileName}";

                return Ok(new { uploadUrl = url, fileUrl = fileUrl });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"שגיאה ביצירת URL עם הרשאות: {ex.Message}");
            }
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

            var (url, key) = await _awsService.UploadFileAsync(stream, request.File.FileName);

            var songDto = new SongDTO
            {
                Name = request.Name,
                MusicStyle = request.MusicStyle,
                SongLength = request.SongLength,
                ReleaseDate = request.ReleaseDate,
                SingerId = request.SingerId,
                S3Url = url,
                Key = key
            };

            var savedSong = await songService.AddAsync(songDto);

            return Ok(new
            {
                Song = savedSong,
                S3Url = url
            });
        }

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
        public async Task<IActionResult> GetAllSongs()
        {
            try
            {
                var request = new ListObjectsV2Request
                {
                    BucketName = _bucketName,
                };

                var response = await _s3Client.ListObjectsV2Async(request);
                var songs = response.S3Objects.Select(obj => obj.Key).ToList();

                return Ok(songs);
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"שגיאה בשליפת השירים: {ex.Message}");
            }
        }
    }
}
