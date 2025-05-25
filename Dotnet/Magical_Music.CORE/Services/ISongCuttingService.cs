using Magical_Music.CORE.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Magical_Music.CORE.Services
{
    public interface ISongCuttingService
    {
        Task<string> CutSongAsync(SongCutRequest request);
    }
}