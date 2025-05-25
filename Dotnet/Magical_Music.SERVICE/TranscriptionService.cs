using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Magical_Music.CORE.Services;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Magical_Music.SERVICE
{
    public class TranscriptionService : ITranscriptionService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public TranscriptionService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["AssemblyAI:ApiKey"];
        }

        public async Task<string> TranscribeAudioAsync(string audioFilePath)
        {
            var audioFile = File.ReadAllBytes(audioFilePath);
            var uploadResponse = await UploadAudio(audioFile);
            string audioUrl = uploadResponse.upload_url;

            var transcriptId = await CreateTranscript(audioUrl);
            return await CheckTranscription(transcriptId);
        }

        private async Task<dynamic> UploadAudio(byte[] audioFile)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            var content = new ByteArrayContent(audioFile);
            content.Headers.ContentType = new MediaTypeHeaderValue("audio/wav");

            var response = await _httpClient.PostAsync("https://api.assemblyai.com/v2/upload", content);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<dynamic>(jsonResponse);
        }

        private async Task<string> CreateTranscript(string audioUrl)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            var requestBody = new { audio_url = audioUrl };
            var content = new StringContent(JsonConvert.SerializeObject(requestBody), System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.assemblyai.com/v2/transcript", content);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var transcriptResponse = JsonConvert.DeserializeObject<dynamic>(jsonResponse);
            return transcriptResponse.id;
        }

        private async Task<string> CheckTranscription(string transcriptId)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            while (true)
            {
                var response = await _httpClient.GetAsync($"https://api.assemblyai.com/v2/transcript/{transcriptId}");
                response.EnsureSuccessStatusCode();

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var resultResponse = JsonConvert.DeserializeObject<dynamic>(jsonResponse);

                if (resultResponse.status == "completed")
                {
                    return resultResponse.text.ToString();
                }
                else if (resultResponse.status == "failed")
                {
                    return "Transcription failed";
                }
                else
                {
                    await Task.Delay(5000); // המתן 5 שניות
                }
            }
        }
    }
}
