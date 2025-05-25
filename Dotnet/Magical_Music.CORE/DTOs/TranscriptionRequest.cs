using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.CORE.DTOs
{
    public record TranscriptionRequest(IFormFile AudioFile);

}
