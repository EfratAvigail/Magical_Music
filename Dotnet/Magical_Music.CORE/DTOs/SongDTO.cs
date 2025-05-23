using System;

namespace Magical_Music.CORE.DTOs
{
    public class SongDTO
    {
        public string Name { get; set; }
        public string MusicStyle { get; set; }
        public TimeSpan SongLength { get; set; } // אם SongLength נדרש להיות TimeSpan, יש לשנות את הסוג
        public DateTime ReleaseDate { get; set; }
        public int SingerId { get; set; }
        public string S3Url { get; set; }
        public string Key { get; set; }
        public string ImageUrl { get; set; } // הוסף את השדה הזה
    }
}
