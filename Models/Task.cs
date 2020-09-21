using System;
using System.ComponentModel.DataAnnotations;

namespace Tazkr.Models
{
    public class Task
    {
        public int Id { get; set; }

        [Required]
        public Board Board { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Desc { get; set; }
        #nullable enable
        [Required]
        public ApplicationUser? AssignedTo { get; set; }
        #nullable disable

    }
}
