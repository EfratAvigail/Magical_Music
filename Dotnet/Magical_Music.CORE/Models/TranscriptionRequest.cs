using Microsoft.AspNetCore.Http;

namespace Magical_Music.CORE.Models
{
    public class TranscriptionRequest
    {
        public IFormFile AudioFile { get; set; }
    }
}
