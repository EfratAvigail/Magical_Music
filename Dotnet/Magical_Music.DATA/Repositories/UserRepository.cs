
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;
using Magical_Music.CORE.Models;
using Magical_Music.CORE.Repositories;
using Magical_Music.DATA;


namespace Magical_Music.DATA.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context) => _context = context;

        public async Task<IEnumerable<User>> GetAllAsync() => await _context.Users.Include(u => u.Songs).ToListAsync();
        public async Task<User> GetByIdAsync(int id) => await _context.Users.FindAsync(id);

        public async Task<User> AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<User>> GetByPasswordAsync(string password)
        {
            return await _context.Users.Where(a => a.Password == password).ToListAsync();
        }
     

        public async Task<User> UpdateAsync(int id, User user)
        {
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser != null)
            {
                existingUser.Name = user.Name;
                existingUser.Email = user.Email;
                existingUser.Password = user.Password;
                await _context.SaveChangesAsync();
            }
            return existingUser;
        }
        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
