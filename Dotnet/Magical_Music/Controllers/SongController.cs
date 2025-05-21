using Magical_Music.CORE.Services;
using Magical_Music.CORE.Models;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Magical_Music.CORE.DTOs;

namespace Magical_Music.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongController : ControllerBase
    {
        private readonly ISongService _songService;
        public SongController(ISongService songService)
        {
            _songService = songService;
        }


        [HttpGet]
        public async Task<IEnumerable<Song>> GetAll()
        {
            return await _songService.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Song>> GetById(int id)
        {
            var song = await _songService.GetByIdAsync(id);
            if (song == null) return NotFound();
            return song;
        }


        [HttpGet("byCreator/{creatorId}")]
        public async Task<IActionResult> GetSongsByCreatorId(int creatorId)
        {
            var songs = await _songService.GetByCreatorIdAsync(creatorId);

            if (songs == null || !songs.Any())
            {
                return NotFound("No songs found for this creator.");
            }

            return Ok(songs);
        }

        [HttpPost]
        public async Task<ActionResult<Song>> Add([FromBody] SongDTO songDto)
        {
            var song = await _songService.AddAsync(songDto);
            return CreatedAtAction(nameof(GetById), new { id = song.Id }, song);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SongDTO song)
        {
            Song s = await _songService.UpdateAsync(id, song);
            if (s == null)
            {
                return NotFound();
            }
            return Ok(s);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _songService.DeleteAsync(id);
            return NoContent();
        }
    }
}
