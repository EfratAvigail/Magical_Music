using System.Threading.Tasks;

namespace Magical_Music.CORE.Services
{
    public interface ITranscriptionService
    {
        Task<string> TranscribeAudioAsync(string audioFilePath);
    }
}
