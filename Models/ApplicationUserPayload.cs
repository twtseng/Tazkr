using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tazkr.Models
{
    /// <summary>
    /// Subset of ApplicationUser object to be returned to client app
    /// </summary>
    public class ApplicationUserPayload
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Id { get; set; }
        public ApplicationUserPayload(ApplicationUser appUser)
        {
            this.UserName = appUser != null ? appUser.UserName : "<null>";
            this.Email =  appUser != null ? appUser.Email : "<null>";
            this.Id = appUser != null ? appUser.Id : "<null>";
        }
    }
}
