using Magical_Music.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.CORE.Repositories
{
    public interface ISingerRepository
    {
         Task<IEnumerable<Singer>> GetAllAsync();
         Task<Singer> GetByIdAsync(int id);
        Task<Singer> GetByNameAsync(string name); // הוסף את הפונקציה הזו

         Task<Singer> AddAsync(Singer singer);
         Task<Singer> UpdateAsync(int id, Singer singer);
         Task DeleteAsync(int id);
    }
}
