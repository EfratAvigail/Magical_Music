using AutoMapper;
using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Models;
using Magical_Music.CORE.Repositories;
using Magical_Music.CORE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.SERVICE
{
   public class SingerService:ISingerService
    {
        private readonly ISingerRepository _singerrRepository;
        private readonly IMapper _mapper;

        public SingerService(ISingerRepository singerRepository, IMapper mapper)
        {
            _singerrRepository = singerRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Singer>> GetAllAsync() => await _singerrRepository.GetAllAsync();
        public async Task<Singer> GetByIdAsync(int id) => await _singerrRepository.GetByIdAsync(id);
        public async Task<Singer> AddAsync(SingerDTO creatorDTO)
        {
            var creator = new Singer
            {
                Name = creatorDTO.Name,

            };
            return await _singerrRepository.AddAsync(creator);
        }




        public async Task<Singer> UpdateAsync(int id, SingerDTO Creator)
        {
            var creatorMap = _mapper.Map<Singer>(Creator);

            return await _singerrRepository.UpdateAsync(id, creatorMap);
        }
        public async Task DeleteAsync(int id) => await _singerrRepository.DeleteAsync(id);

    }
}
