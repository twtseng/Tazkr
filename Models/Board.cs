using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Tazkr.Models
{
    public class Board
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public bool Archived { get; set; }
        [Required]
        public ApplicationUser CreatedBy { get; set;}
        [Required]
        public ApplicationUser UpdatedBy { get; set; }
        [Required]
        public DateTime CreateTimeUtc { get; set; }   
        [Required]
        public DateTime UpdateTimeUtc { get; set; }  
        public ICollection<ApplicationUser> ActiveUsers { get; set; }
        public ICollection<Column> Columns { get; set; }

    }
}
