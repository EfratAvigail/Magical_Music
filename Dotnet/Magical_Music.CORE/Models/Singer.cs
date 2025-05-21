using Magical_Music.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Magical_Music.CORE.Models
{
    public class Singer
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public List<Song> song { get; set; }


    }
}


