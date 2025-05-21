using Magical_Music.CORE.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Magical_Music.CORE.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(int id);
        Task<User> AddAsync(User user);
        Task<User> UpdateAsync(int id, User user);
        Task DeleteAsync(int id);
        Task<IEnumerable<User>> GetByPasswordAsync(string Password);
        Task<User> GetByEmailAsync(string email); // הוספת המתודה GetByEmailAsync

    }
}
