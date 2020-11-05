// using System;
// using System.Linq;
// using System.Collections.Generic;
// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;
// using System.Threading.Tasks;
// using Newtonsoft.Json;
// using Microsoft.AspNetCore.SignalR;
// using Microsoft.Extensions.Logging;
// using Microsoft.EntityFrameworkCore;
// using Tazkr.Controllers;

// namespace Tazkr.Models
// {
//     /// <summary>
//     /// Subset of Board object to be returned to client app
//     /// </summary>
//     public class BoardPayload 
//     {
//         public enum PermissionLevels {
//             Owner, // Full permissions on the board
//             User, // Can edit and move items but not delete
//             Viewer // Can view only and not modify data
//         }

//         public string Title { get; set; }
//         public ApplicationUserPayload CreatedBy { get; set; }
//         public List<ApplicationUserPayload> BoardUsers { get; set; }
//         public List<ColumnPayload> Columns { get; set; }

//         public BoardPayload(Board board)
//         {
//             this.Id = board != null ? board.Id : "<null>";
//             this.Title = board != null ? board.Title : "<null>";
//             this.CreatedBy = new ApplicationUserPayload(board.CreatedBy);
//             this.Columns = board.Columns != null? board.Columns.Select(column => new ColumnPayload(column)).ToList() : new List<ColumnPayload>();
//             this.BoardUsers = board.BoardUsers != null ? board.BoardUsers.Select(user => new ApplicationUserPayload(user.ApplicationUser)).ToList() : new List<ApplicationUserPayload>();
//         }
//         public string PermissionLevel { get; set; }

//     }
// }
