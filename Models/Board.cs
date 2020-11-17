using System;
using System.Dynamic;
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
            Owner=1, // Full permissions on the board
            User=2, // Can edit and move items but not delete
            Viewer=3, // Can view only and not modify data
            None=4 // User cannot view board
        }
        public string Title { get; set; }
        public string CreatedById { get; set; }
        [InverseProperty("BoardsCreated")]
        public ApplicationUser CreatedBy { get; set; }
        public List<BoardUser> BoardUsers { get; set; }
        public List<Column> Columns { get; set; }
        public bool IsPubliclyVisible { get; set; } 

        public PermissionLevels GetPermissionLevelForUser(ApplicationUser user)
        {
            if (this.CreatedById == user.Id)
            {
                return PermissionLevels.Owner;
            }
            else if (this.BoardUsers.Exists(x => x.ApplicationUserId == user.Id)) 
            {
                return Board.PermissionLevels.User;
            }
            else if (this.IsPubliclyVisible)
            {
               return Board.PermissionLevels.Viewer;
            }
            else
            {
                return Board.PermissionLevels.None;
            }
        }
       public dynamic GetMinimumServerResponsePayload(ApplicationUser user)
        {
            dynamic obj = new ExpandoObject();
            obj.Id = this.Id;
            obj.UpdateHashCode = this.UpdateHashCode;
            obj.CreatedDateUTC = this.CreatedDateUTC;
            obj.CreatedBy = this.CreatedBy == null ? null : this.CreatedBy.GetServerResponsePayload();
            obj.Title = this.Title;
            obj.PermissionLevel = this.GetPermissionLevelForUser(user).ToString();
            obj.IsPubliclyVisible = this.IsPubliclyVisible;
            return obj;
        }
        public override dynamic GetServerResponsePayload(ApplicationUser user)
        {
            dynamic obj = this.GetMinimumServerResponsePayload(user);
            obj.Columns = this.Columns == null ? new List<Object>() : this.Columns.Select(x => x.GetServerResponsePayload(user)).ToList();
            obj.BoardUsers = this.BoardUsers == null ? new List<Object>() : this.BoardUsers.Select(x => x.ApplicationUser.GetServerResponsePayload()).ToList();
            return obj;
        }
    }
}
