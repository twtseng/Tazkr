using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tazkr.Models
{
    public class Card : BaseEntity
    {
        public enum Priority
        { 
            Low,
            Med,
            High 
        };

        /// <summary>
        /// Order that this card appears on the column
        /// </summary>
        public int Index { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Priority Pri_Level { get; set; }
        public string ColumnId { get; set; }
        public Column Column { get; set; }

        public override Object GetServerResponsePayload()
        {
            return new {
                this.Id,
                this.UpdateHashCode,        
                this.Index,
                this.Title,
                this.Description,
                Pri_Level = this.Pri_Level.ToString()
            };
        }
    }
}
