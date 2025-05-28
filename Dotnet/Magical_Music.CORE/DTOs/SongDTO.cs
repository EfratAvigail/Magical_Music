using Microsoft.AspNetCore.Http;
using System;

namespace Magical_Music.CORE.DTOs
{
    public class SongDTO
    {
        public string Name { get; set; }
        public string MusicStyle { get; set; }
        public TimeSpan SongLength { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string S3Url { get; set; }
        public string Key { get; set; }
        public string ImageUrl { get; set; }
    }

}
