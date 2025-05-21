using AutoMapper;
using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Models;
using Magical_Music.CORE.Repositories;
using Magical_Music.CORE.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Magical_Music.SERVICE
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<User>> GetAllAsync() => await _userRepository.GetAllAsync();
        public async Task<User> GetByIdAsync(int id) => await _userRepository.GetByIdAsync(id);
        public async Task<User> GetByEmailAsync(string email) => await _userRepository.GetByEmailAsync(email);

        public async Task<User> AddAsync(UserDTO userDto)
        {
            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = userDto.Password,
                Role = "user"
            };

            return await _userRepository.AddAsync(user);
        }

        public async Task<User> UpdateAsync(int id, UserDTO userDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            user.Name = userDto.Name;
            user.Email = userDto.Email;
            user.Password = userDto.Password;

            return await _userRepository.UpdateAsync(id, user);
        }

        public async Task DeleteAsync(int id) => await _userRepository.DeleteAsync(id);


        public User Authenticate(string username, string userPassword)
        {
            // בדיקה אם המשתמש קיים במאגר הנתונים לפי הסיסמה
            var users = _userRepository.GetByPasswordAsync(userPassword).Result; // קבלת המשתמשים לפי סיסמה
            var user = users.FirstOrDefault(u => u.Name == username); // בחר את המשתמש הראשון שתואם לשם המשתמש

            if (user != null) // אם המשתמש קיים
            {
                user.Role = "user"; // משתמש רגיל
                return user;
            }

            // אם המשתמש לא נמצא במערכת → הוא "צופה"
            return new User
            {
                Name = username,
                Password = userPassword,
                Role = "viewer" // תפקיד "צופה"
            };
        }


    }
}
