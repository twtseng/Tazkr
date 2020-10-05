using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tazkr.Models
{
    public class Column
    {
        [Key]
        public int ColumnId { get; set; }
        public string Title { get; set; }
        public int BoardId { get; set; }
        public Board Board { get; set; }
        public List<Card> Cards { get; set; }
    }
}
