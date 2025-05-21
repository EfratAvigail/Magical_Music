using AutoMapper;
using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Models;
using Magical_Music.CORE.Repositories;
using Magical_Music.CORE.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Crypto;
using System;
using System.Reflection;

namespace Magical_Music.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SingerController : ControllerBase
    {
        private readonly ISingerService _singerService;
        public SingerController(ISingerService creatorService)
        {
            _singerService = creatorService;
        }


        [HttpGet]
        public async Task<IEnumerable<Singer>> GetAll()
        {
            return await _singerService.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Singer>> GetById(int id)
        {
            var Singer = await _singerService.GetByIdAsync(id);
            if (Singer == null) return NotFound();
            return Singer;
        }

        [HttpPost]
        public async Task<ActionResult<Singer>> Add([FromBody] SingerDTO creatorDTO)
        {

            var singer = await _singerService.AddAsync(creatorDTO);
            return CreatedAtAction(nameof(GetById), new { id = singer.Id }, singer);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SingerDTO singer)
        {

            Singer s = await _singerService.UpdateAsync(id, singer);
            if (s == null)
            {
                return NotFound();
            }
            return Ok(s);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _singerService.DeleteAsync(id);
            return NoContent();
        }
    }
}
