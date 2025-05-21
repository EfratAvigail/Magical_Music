using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.SERVICE
{
    public class AWSService
    {

        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        public AWSService(IConfiguration configuration) // namespace מלא
        {
            var awsOptions = configuration.GetSection("AWS");
            var accessKey = awsOptions["AccessKey"];
            var secretKey = awsOptions["SecretKey"];
            var region = awsOptions["Region"];
            _bucketName = awsOptions["BucketName"];

            _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(region));
        }



        public string GeneratePresignedUrlAsync(string fileName, string contentType)
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
                // טיפול בשגיאה
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

