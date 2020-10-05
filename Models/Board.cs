using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tazkr.Models
{
    public class Board
    {
        [Key]
        public int BoardId { get; set; }
        public string Title { get; set; }

        [InverseProperty("BoardsCreated")]
        public ApplicationUser CreatedBy { get; set; }
        public List<BoardUser> BoardUsers { get; set; }

    }
}
