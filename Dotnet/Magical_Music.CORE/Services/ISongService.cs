using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.CORE.Services
{
    public interface ISongService
    {
        public Task<IEnumerable<Song>> GetAllAsync();
        public Task<Song> GetByIdAsync(int id);
        public Task<IEnumerable<Song>> GetByCreatorIdAsync(int creatorId);
        public Task<Song> AddAsync(SongDTO song);
        public Task<Song> UpdateAsync(int id, SongDTO song);
        public Task DeleteAsync(int id);
    }
}
