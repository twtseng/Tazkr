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
            this.BoardId = board.BoardId;
            this.Title = board.Title;
            this.CreatedBy = new ApplicationUserPayload(board.CreatedBy);
            this.Columns = new List<ColumnPayload>();
            if (board.Columns != null)
            {
                this.Columns = board.Columns.Select(column => new ColumnPayload(column)).ToList();
            }
        }
    }
}
