using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tazkr.Models
{
    public class Column : BaseEntity
    {
        public Column()
        {
            this.ColumnId = System.Guid.NewGuid().ToString();
        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string ColumnId { get; set; }
        /// <summary>
        /// Order that this column appears on the board
        /// </summary>
        public int Index { get; set; }
        public string Title { get; set; }
        public string BoardId { get; set; }
        public Board Board { get; set; }
        public List<Card> Cards { get; set; }
    }
}
