using Magical_Music.CORE.Models;
using Magical_Music.CORE.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.SERVICE
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;

        public AuthService(IConfiguration configuration, IUserRepository userRepository)
        {
            _configuration = configuration;
            _userRepository = userRepository;
        }

        public string GenerateJwtToken(string email, string password)
        {
            // בדוק אם יש משתמש עם המייל וסיסמה נתונים
            var user = _userRepository.GetByEmailAsync(email).Result; // קבלת המשתמש לפי מייל
            if (user != null && BCrypt.Net.BCrypt.Verify(password, user.Password)) // בדוק גם אם הסיסמה נכונה
            {
                // אם המשתמש נמצא, החזר את הטוקן עם תפקידים מתאימים
                return GenerateToken(user.Name, new[] { user.Role });
            }

            // אם לא נמצא, החזר null או אפשרות אחרת
            return null;
        }

        public async Task<RegistrationResult> RegisterUser(RegisterModel model)
        {
            if (string.IsNullOrEmpty(model.Name) || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return new RegistrationResult { Success = false, Message = "כל השדות חייבים להיות מלאים." };
            }

            // בדוק אם המשתמש כבר קיים
            var existingUser = await _userRepository.GetByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return new RegistrationResult { Success = false, Message = "המייל כבר קיים במערכת." };
            }

            // יצירת משתמש חדש
            var newUser = new User
            {
                Name = model.Name,
                Email = model.Email,
                Password = HashPassword(model.Password),
                Role = "user"
            };

            await _userRepository.AddAsync(newUser);
            return new RegistrationResult { Success = true };
        }

        private string GenerateToken(string username, string[] roles)
        {
            // קבלת המפתח מהקונפיגורציה
            var jwtKey = _configuration["JWT_KEY"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new ArgumentNullException("Jwt:Key", "JWT Key must be provided in appsettings.json");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, username),
    };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        private string HashPassword(string password)
        {
            // שימוש ב-BCrypt כדי לאבטח את הסיסמה
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            return hashedPassword;
        }
    }

    public class RegistrationResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}
