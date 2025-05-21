using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Magical_Music.CORE.Models;
using Magical_Music.CORE.Repositories;
using Magical_Music.DATA;

namespace Magical_Music.DATA.Repositories
{
    public class SingerRepository : ISingerRepository
    {
        private readonly DataContext _context;

        public SingerRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Singer>> GetAllAsync()
            => await _context.Singers.Include(s => s.song).ToListAsync(); // תיקון כאן

        public async Task<Singer> GetByIdAsync(int id)
            => await _context.Singers.FindAsync(id);

        public async Task<Singer> GetByNameAsync(string name)
            => await _context.Singers.FirstOrDefaultAsync(s => s.Name == name);

        public async Task<Singer> AddAsync(Singer entity)
        {
            await _context.Singers.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<Singer> UpdateAsync(int id, Singer entity)
        {
            Singer s = await _context.Singers.SingleOrDefaultAsync(act => act.Id == id);
            if (s == null) return null;

            s.Name = entity.Name;
            s.song = entity.song;

            await _context.SaveChangesAsync();
            return s;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Singers.FindAsync(id);
            if (entity != null)
            {
                _context.Singers.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
