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
        public DateTime LastRequestTime { get; set; }
        public Object GetServerResponsePayload()
        {
            dynamic obj = new ExpandoObject();
            obj.UserName = this.UserName;
            obj.Email = this.Email;
            obj.Id = this.Id;
            return obj;
        }
    }
}
