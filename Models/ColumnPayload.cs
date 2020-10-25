using System;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tazkr.Models
{
    /// <summary>
    /// Subset of Client object to be returned to client app
    /// </summary>
    public class ColumnPayload
    {
        public string ColumnId { get; set; }
        /// <summary>
        /// Order that this column appears on the board
        /// </summary>
        public int Index { get; set; }
        public string Title { get; set; }
        public List<CardPayload> Cards { get; set; }
        public ColumnPayload(Column column)
        {
            this.ColumnId = column.ColumnId;
            this.Title = column.Title;
            this.Index = column.Index;
            this.Cards = column.Cards.Select(card => new CardPayload(card)).ToList();
        }
    }
}
