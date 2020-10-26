using System;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Tazkr.Controllers;

namespace Tazkr.Models
{
    /// <summary>
    /// Subset of Board object to be returned to client app
    /// </summary>
    public class BoardPayload
    {
        public string BoardId { get; set; }
        public string Title { get; set; }
        public ApplicationUserPayload CreatedBy { get; set; }
        public List<ColumnPayload> Columns { get; set; }
        public BoardPayload(Board board)
        {
            this.BoardId = board != null ? board.BoardId : "<null>";
            this.Title = board != null ? board.Title : "<null>";
            this.CreatedBy = new ApplicationUserPayload(board.CreatedBy);
            this.Columns = board.Columns != null? board.Columns.Select(column => new ColumnPayload(column)).ToList() : new List<ColumnPayload>();
        }
    }
}
