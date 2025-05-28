using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System;
namespace Magical_Music.CORE.Models
{


    public class UploadSongRequest
    {
        public IFormFile File { get; set; }
        public string Name { get; set; }
        public string MusicStyle { get; set; }
        public TimeSpan SongLength { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string ImageUrl { get; set; } // הוסף את השדה הזה
    }



}
