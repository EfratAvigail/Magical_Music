using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.CORE.Models
{
    public class Song
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string MusicStyle { get; set; }
        public TimeSpan SongLength { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string ImageUrl { get; set; }
        public string S3Url { get; set; }
        public string Key { get; set; }  // שדה חדש למפתח ה-S3
    }

}
