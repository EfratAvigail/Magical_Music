using Microsoft.AspNetCore.Mvc;
using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Services;

namespace Magical_Music.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CutSongController : ControllerBase
    {
        private readonly ISongCuttingService _cutService;

        public CutSongController(ISongCuttingService cutService)
        {
            _cutService = cutService;
        }

        [HttpPost]
        public async Task<IActionResult> Cut([FromBody] SongCutRequest request)
        {
            try
            {
                var outputPath = await _cutService.CutSongAsync(request);

                var fileBytes = await System.IO.File.ReadAllBytesAsync(outputPath);
                var fileName = Path.GetFileName(outputPath);

                // לא מוחקים את הקובץ – כדי שתוכלי לשמור עותק מקומי/לשימוש עתידי

                return File(fileBytes, "audio/mpeg", fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }


    }
}
