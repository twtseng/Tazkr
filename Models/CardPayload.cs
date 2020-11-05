using System;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tazkr.Models
{
    /// <summary>
    /// Subset of Card object to be returned to client app
    /// </summary>
    public class CardPayload : BaseEntity
    {
        /// <summary>
        /// Order that this card appears on the column
        /// </summary>
        public int Index { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Pri_Level { get; set; }
        public CardPayload(Card card) : base(card)
        {
            this.Index = card.Index;
            this.Title = card.Title;
            this.Description = card.Description;
            this.Pri_Level = card.Pri_Level.ToString();
        }

    }
}
