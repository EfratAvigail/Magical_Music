using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Magical_Music.CORE.Services;

namespace Magical_Music.SERVICE
{
    public class TranscriptionService : ITranscriptionService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        public TranscriptionService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<string> TranscribeAudioAsync(string audioFilePath)
        {
            var apiKey = _configuration["OpenAI:ApiKey"];
            var model = _configuration["OpenAI:Model"] ?? "whisper-1";

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            using var multipartContent = new MultipartFormDataContent();

            var extension = Path.GetExtension(audioFilePath).ToLower();
            var mimeType = extension switch
            {
                ".mp3" => "audio/mpeg",
                ".wav" => "audio/wav",
                ".m4a" => "audio/x-m4a",
                _ => "application/octet-stream"
            };

            await using var fileStream = File.OpenRead(audioFilePath);
            var fileContent = new StreamContent(fileStream);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(mimeType);

            multipartContent.Add(fileContent, "file", Path.GetFileName(audioFilePath));
            multipartContent.Add(new StringContent(model), "model");

            var apiBaseUrl = _configuration["OpenAI:BaseUrl"] ?? "https://api.openai.com";
            var response = await client.PostAsync($"{apiBaseUrl}/v1/audio/transcriptions", multipartContent);
            var responseText = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"OpenAI Error: {response.StatusCode} - {responseText}");

            using var jsonDoc = JsonDocument.Parse(responseText);
            var root = jsonDoc.RootElement;

            return root.GetProperty("text").GetString();
        }

    }
}
