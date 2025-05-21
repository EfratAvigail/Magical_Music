using AutoMapper;
using Magical_Music.CORE.DTOs;
using Magical_Music.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;


public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Song, SongDTO>().ReverseMap();
        CreateMap<Singer, SingerDTO>().ReverseMap();
        CreateMap<UserDTO, User>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.Name}")) // מיפוי מותאם
            .ReverseMap();
    }
}
