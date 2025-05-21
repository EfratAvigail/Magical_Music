using Magical_Music.CORE.Models;
using Magical_Music.SERVICE;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Magical_Music.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            var token = _authService.GenerateJwtToken(model.Email, model.Password);

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized();
            }

            return Ok(new { Token = token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model) // הוספת async
        {
            var result = await _authService.RegisterUser(model); // הוספת await

            if (!result.Success) // שינוי ל- result.Success
            {
                return BadRequest(new { Message = result.Message });
            }

            return Ok(new { Message = "נרשמת בהצלחה!" });
        }
    }
}
