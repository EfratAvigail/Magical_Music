using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

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
            var key = fileName;

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = fileStream,
                BucketName = _bucketName,
                Key = key,
                ContentType = "audio/mpeg"
            };

            var transferUtility = new TransferUtility(_s3Client);
            await transferUtility.UploadAsync(uploadRequest);

            // בניית URL בפורמט שאתה רוצה
            var url = $"https://s3.eu-north-1.amazonaws.com/{_bucketName}/{key}";
            return (url, key);
        }


        public string GeneratePresignedUploadUrl(string fileKey, string contentType)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileKey,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(10),
                ContentType = contentType
            };
            request.Headers["x-amz-acl"] = "bucket-owner-full-control";
            return _s3Client.GetPreSignedURL(request);
        }

        public string GeneratePresignedDownloadUrl(string fileKey)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileKey,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(10),
                ResponseHeaderOverrides = new ResponseHeaderOverrides
                {
                    ContentDisposition = $"attachment; filename=\"{Path.GetFileName(fileKey)}\""
                }
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
            return response.S3Objects.Select(obj => obj.Key).ToList();
        }
    }
}
