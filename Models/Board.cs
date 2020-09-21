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
        public ApplicationUser CreatedBy { get; set;}
        public ICollection<ApplicationUser> ActiveUsers { get; set; }
        public ICollection<Column> Columns { get; set; }

    }
}
