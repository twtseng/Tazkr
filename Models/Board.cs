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
    public class Board : BaseEntity
    {
        public enum PermissionLevels {
            Owner, // Full permissions on the board
            User, // Can edit and move items but not delete
            Viewer // Can view only and not modify data
        }
        public string Title { get; set; }
        public string CreatedById { get; set; }
        [InverseProperty("BoardsCreated")]
        public ApplicationUser CreatedBy { get; set; }
        public List<BoardUser> BoardUsers { get; set; }
        public List<Column> Columns { get; set; }

        public override Object GetServerResponsePayload()
        {
            return new {           
                this.Id,
                this.UpdateHashCode,
                CreatedBy = this.CreatedBy == null ? null : this.CreatedBy.GetServerResponsePayload(),
                this.Title,
                Columns = this.Columns == null ? new List<Object>() : this.Columns.Select(x => x.GetServerResponsePayload()).ToList(),
                BoardUsers = this.BoardUsers == null ? new List<Object>() : this.BoardUsers.Select(x => x.ApplicationUser.GetServerResponsePayload()).ToList()
            };
        }
    }
}
