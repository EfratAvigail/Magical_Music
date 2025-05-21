using Magical_Music.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.CORE.Repositories
{
    public interface ISongRepository
    {
         Task<IEnumerable<Song>> GetAllAsync();
         Task<Song> GetByIdAsync(int id);
         Task<Song> AddAsync(Song song);
         Task<Song> UpdateAsync(int id, Song song);
         Task DeleteAsync(int id);
        Task<IEnumerable<Song>> GetByCreatorIdAsync(int creatorId);
    }
}
