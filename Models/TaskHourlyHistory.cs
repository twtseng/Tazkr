using System;
using System.ComponentModel.DataAnnotations;

namespace Tazkr.Models
{
    public class TaskHourlyHistory
    {
        public int Id { get; set; }

        [Required]
        public Column Column { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Desc { get; set; }
        [Required]
        public bool Archived { get; set; }
        [Required]
        public ApplicationUser UpdatedBy { get; set; }
        [Required]
        public DateTime CreateTimeUtc { get; set; }   
        [Required]
        public DateTime UpdateTimeUtc { get; set; }       
        [Required]
        public DateTime UpdateHourUtc { get; set; }   
        #nullable enable
        [Required]
        public ApplicationUser? AssignedTo { get; set; }
        #nullable disable

    }
}
