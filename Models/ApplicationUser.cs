using Microsoft.AspNetCore.Identity;
using System;
using System.Dynamic;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tazkr.Models
{
    public class ApplicationUser : IdentityUser
    {
        public List<Board> BoardsCreated { get; set; }
        public List<BoardUser> Boards { get; set; }
        public DateTime LastRequestTimeUTC { get; set; }
        public dynamic GetServerResponsePayload()
        {
            dynamic obj = new ExpandoObject();
            obj.UserName = this.UserName;
            obj.Email = this.Email;
            obj.Id = this.Id;
            obj.LastRequestTimeUTC = this.LastRequestTimeUTC;
            obj.Online = (DateTime.UtcNow - this.LastRequestTimeUTC).TotalMinutes < 2;
            return obj;
        }
    }
}
