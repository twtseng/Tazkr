// using System;
// using System.Linq;
// using System.Collections.Generic;
// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;

// namespace Tazkr.Models
// {
//     /// <summary>
//     /// Subset of Column object to be returned to client app
//     /// </summary>
//     public class ColumnPayload : BaseEntity
//     {
//         /// <summary>
//         /// Order that this column appears on the board
//         /// </summary>
//         public int Index { get; set; }
//         public string Title { get; set; }
//         public List<CardPayload> Cards { get; set; }
//         public ColumnPayload(Column column) : base(column)
//         {
//             this.Title = column != null ? column.Title : "<null>";
//             this.Index = column != null ? column.Index : 0;
//             this.Cards = column != null ? column.Cards.Select(card => new CardPayload(card)).ToList() : new List<CardPayload>();
//         }
//     }
// }
