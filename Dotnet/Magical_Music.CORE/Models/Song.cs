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
        public int singerId { get; set; }

        public Singer Singer { get; set; }

        public ICollection<User> Users { get; set; }
    }
}
