using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Magical_Music.CORE.Services
{
    public interface ITranscriptionService
    {
        Task<string> TranscribeAudioAsync(string audioFilePath);
    }
}
