using AutoMapper;
using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Models;
using Magical_Music.CORE.Repositories;
using Magical_Music.CORE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
namespace Magical_Music.SERVICE
{
    public class SongService : ISongService
    {
        private readonly ISongRepository _songRepository;
        private readonly IMapper _mapper;

        public SongService(ISongRepository songRepository, IMapper mapper)
        {
            _songRepository = songRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Song>> GetAllAsync() => await _songRepository.GetAllAsync();
        public async Task<Song> GetByIdAsync(int id) => await _songRepository.GetByIdAsync(id);
        public async Task<IEnumerable<Song>> GetByCreatorIdAsync(int creatorId)
        {
            return await _songRepository.GetByCreatorIdAsync(creatorId);
        }

        public async Task<Song> AddAsync(SongDTO songDto)
        {
            var song = new Song
            {
                Name = songDto.Name,
                MusicStyle = songDto.MusicStyle,
                SongLength = songDto.SongLength,
                ReleaseDate = songDto.ReleaseDate,
                ImageUrl = songDto.ImageUrl,
                SingerId = songDto.SingerId
            };

            return await _songRepository.AddAsync(song);
        }


        public async Task<Song> UpdateAsync(int id, SongDTO song)
        {
            var songMap = _mapper.Map<Song>(song);
            return await _songRepository.UpdateAsync(id, songMap);
        }
        public async Task DeleteAsync(int id) => await _songRepository.DeleteAsync(id);
    }
}
