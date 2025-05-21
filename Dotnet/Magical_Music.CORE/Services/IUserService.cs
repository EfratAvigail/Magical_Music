using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Magical_Music.CORE.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(int id);
        Task<User> GetByEmailAsync(string email);
        Task<User> AddAsync(UserDTO user);
        Task<User> UpdateAsync(int id, UserDTO user);
        Task DeleteAsync(int id);
        User Authenticate(string username, string userPassword);

    }
}
