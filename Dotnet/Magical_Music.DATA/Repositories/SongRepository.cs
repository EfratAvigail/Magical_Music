using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Magical_Music.CORE.Models;
using Magical_Music.CORE.Repositories;
using Magical_Music.DATA;

namespace MagicalMusic.DATA.Repositories
{
    public class SongRepository : ISongRepository
    {
        private readonly DataContext _context;

        public SongRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Song>> GetAllAsync() => await _context.Songs.Include(s => s.Singer).Include(s => s.Users).ToListAsync();

     

        public async Task<Song> GetByIdAsync(int id)
        {
            return await _context.Songs.FindAsync(id);
        }

        public async Task<IEnumerable<Song>> GetByCreatorIdAsync(int creatorId)
        {
            return await _context.Songs.Where(s => s.singerId == creatorId).ToListAsync();
        }

        public async Task<IEnumerable<Song>> GetSongsByGenreAsync(string MusicStyle)
        {
            return await _context.Songs.Where(s => s.MusicStyle == MusicStyle).ToListAsync();
        }

        public async Task<Song> AddAsync(Song song)
        {
            await _context.Songs.AddAsync(song);
            return song;
        }

        public async Task<Song> UpdateAsync(int id, Song song)
        {
            Song s = await _context.Songs.SingleOrDefaultAsync(act => act.Id == id);
            if (s == null) return null;

            s.Name = song.Name;
            s.MusicStyle = song.MusicStyle;
            s.SongLength = song.SongLength;
            s.ImageUrl = song.ImageUrl;
            s.ReleaseDate = song.ReleaseDate;
            s.singerId = song.singerId;

            return s;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Songs.FindAsync(id);
            if (entity != null)
            {
                _context.Songs.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
