using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.CORE.Models
{
    public class CutRequest
    {
        public string S3Bucket { get; set; } = string.Empty;
        public string InputKey { get; set; } = string.Empty;
        public double StartTime { get; set; } // in seconds
        public double Duration { get; set; }  // in seconds
        public string OutputKey { get; set; } = string.Empty;
    }

}
