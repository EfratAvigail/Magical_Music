using Magical_Music.CORE.Services;
using Magical_Music.CORE.Models;
using Microsoft.AspNetCore.Mvc;

namespace Magical_Music.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TranscriptionController : ControllerBase
    {
        private readonly ITranscriptionService _transcriptionService;

        public TranscriptionController(ITranscriptionService transcriptionService)
        {
            _transcriptionService = transcriptionService;
        }

        [HttpPost("transcribe")]
        public async Task<IActionResult> TranscribeAudio([FromForm] TranscriptionRequest request)
        {
            if (request.AudioFile == null || request.AudioFile.Length == 0)
                return BadRequest("No audio file provided.");

            var allowedExtensions = new[] { ".mp3", ".wav", ".m4a" };
            var extension = Path.GetExtension(request.AudioFile.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
                return BadRequest("File format not supported. Only mp3, wav, and m4a are supported.");

            var tempFilePath = Path.GetTempFileName();
            try
            {
                using (var stream = System.IO.File.Create(tempFilePath))
                {
                    await request.AudioFile.CopyToAsync(stream);
                }

                var result = await _transcriptionService.TranscribeAudioAsync(tempFilePath);
                return Ok(new { text = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error during transcription: {ex.Message}");
            }
            finally
            {
                if (System.IO.File.Exists(tempFilePath))
                    System.IO.File.Delete(tempFilePath);
            }
        }
    }
}
