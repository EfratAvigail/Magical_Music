using Magical_Music.CORE.Models;
using Magical_Music.CORE.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Magical_Music.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;

        public EmailController(IEmailService emailService, IUserService userService)
        {
            _emailService = emailService;
            _userService = userService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            if (request.Body == "שחזור סיסמה")
            {
                var user = await _userService.GetByEmailAsync(request.To);
                if (user == null)
                    return Forbid();

                Random random = new Random();
                int randomNumber = random.Next(100000, 1000000);
                request.Body = $@"
                <div style='border: 2px solid #FFA500; background-color: #FFA500; padding: 20px; text-align: center;'>
                <h1 style='font-size: 24px; color: white;'>שחזור סיסמה</h1>
                <p style='font-size: 20px; color: white;'>הקוד שלך הוא: <strong>{randomNumber}</strong></p>
                </div>";

                await _emailService.SendEmailAsync(request);
                return Ok(new { randomPassword = randomNumber });
            }
            await _emailService.SendEmailAsync(request);
            return Ok();
        }
    }
}
