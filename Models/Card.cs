using System;
using System.Dynamic;

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
        public override dynamic GetServerResponsePayload()
        {
            dynamic obj = new ExpandoObject();
            obj.Id = this.Id;
            obj.UpdateHashCode = this.UpdateHashCode;
            obj.Index = this.Index;
            obj.Title = this.Title;
            obj.Description = this.Description;
            obj.Pri_Level = this.Pri_Level.ToString();
            return obj;
        }
    }
}
