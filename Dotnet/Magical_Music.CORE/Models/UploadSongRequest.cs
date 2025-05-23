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
        public IFormFile File { get; set; } // עבור הקובץ המועלה
        public string Name { get; set; } // שם השיר
        public string MusicStyle { get; set; } // סגנון מוזיקה
        public TimeSpan SongLength { get; set; } // אורך השיר
        public DateTime ReleaseDate { get; set; } // תאריך שחרור
        public int SingerId { get; set; } // מזהה היוצר
    }


}
