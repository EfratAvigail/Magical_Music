using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.CORE.Services
{
   public interface ISingerService
    {
        public Task<IEnumerable<Singer>> GetAllAsync();
        public Task<Singer> GetByIdAsync(int id);
        public Task<Singer> AddAsync(SingerDTO creator);
        public Task<Singer> UpdateAsync(int id, SingerDTO creator);
        public Task DeleteAsync(int id);
    }
}
