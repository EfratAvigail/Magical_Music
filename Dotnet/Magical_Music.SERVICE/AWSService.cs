using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Magical_Music.SERVICE
{
    public class AWSService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public AWSService(IConfiguration configuration)
        {
            var awsOptions = configuration.GetSection("AWS");
            var accessKey = awsOptions["AccessKey"];
            var secretKey = awsOptions["SecretKey"];
            var region = awsOptions["Region"];
            _bucketName = awsOptions["BucketName"];

            _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(region));
        }

        public async Task<(string url, string key)> UploadFileAsync(Stream fileStream, string fileName)
        {
            var key = $"songs/{Guid.NewGuid()}_{fileName}";

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = fileStream,
                BucketName = _bucketName,
                Key = key,
                ContentType = "audio/mpeg" // או סוג תוכן אחר בהתאם לסוג הקובץ
            };

            var transferUtility = new TransferUtility(_s3Client);
            await transferUtility.UploadAsync(uploadRequest);

            return ($"https://{_bucketName}.s3.amazonaws.com/{key}", key);
        }

        public string GeneratePresignedUrl(string fileName, string contentType)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(10),
                ContentType = contentType
            };

            try
            {
                var url = _s3Client.GetPreSignedURL(request);
                return url;
            }
            catch (AmazonS3Exception ex)
            {
                throw new Exception($"שגיאה ביצירת URL חתום: {ex.Message}");
            }
        }

        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(30) // תוקף של 30 דקות
            };
            return _s3Client.GetPreSignedURL(request);
        }

        public async Task<List<string>> GetAllSongsAsync()
        {
            var request = new ListObjectsV2Request
            {
                BucketName = _bucketName,
            };

            var response = await _s3Client.ListObjectsV2Async(request);
            return response.S3Objects.Select(obj => obj.Key).ToList(); // מחזיר את רשימת השירים
        }
    }
}
