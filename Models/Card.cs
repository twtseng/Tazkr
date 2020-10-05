using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tazkr.Models
{
    public class Card
    {
        public enum Priority 
        { 
            Low,
            Med,
            High 
        };
        [Key]
        public int CardId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Priority Pri_Level { get; set; }
        public int ColumnId { get; set; }
        public Column Column { get; set; }

    }
}
