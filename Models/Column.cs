using System;
using System.ComponentModel.DataAnnotations;

namespace Tazkr.Models
{
    public class Column
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
    }
}
