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
    public class Board
    {
        public Board()
        {
            this.BoardId = System.Guid.NewGuid().ToString();
        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string BoardId { get; set; }
        public string Title { get; set; }

        public string CreatedById { get; set; }
        [InverseProperty("BoardsCreated")]
        public ApplicationUser CreatedBy { get; set; }
        public List<BoardUser> BoardUsers { get; set; }
        public List<Column> Columns { get; set; }
    }
}
