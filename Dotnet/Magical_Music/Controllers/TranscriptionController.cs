using Microsoft.AspNetCore.Mvc;
using Magical_Music.SERVICE;
using System.IO;
using System.Threading.Tasks;
using Magical_Music.CORE.Services;
using Magical_Music.CORE.DTOs;

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

        [HttpPost]
        [Consumes("multipart/form-data")] // הוספת תמיכה ב-multipart
        public async Task<IActionResult> TranscribeAudio([FromForm] TranscriptionRequest request)
        {
            if (request.AudioFile == null || request.AudioFile.Length == 0)
                return BadRequest("Audio file must be provided.");

            var audioFilePath = Path.Combine(Path.GetTempPath(), request.AudioFile.FileName);
            using (var stream = new FileStream(audioFilePath, FileMode.Create))
            {
                await request.AudioFile.CopyToAsync(stream);
            }

            string result = await _transcriptionService.TranscribeAudioAsync(audioFilePath);
            return Ok(result);
        }
    }
}
