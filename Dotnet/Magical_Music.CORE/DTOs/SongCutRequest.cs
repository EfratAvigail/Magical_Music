using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.CORE.DTOs
{
    public class SongCutRequest
    {
        public string SongKey { get; set; } = string.Empty; // שם הקובץ ב־S3
        public double StartSeconds { get; set; }
        public double EndSeconds { get; set; }
    }
}
