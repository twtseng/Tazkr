using System;
using System.Dynamic;

namespace Tazkr.Models
{
    public class ChatMessage : BaseEntity
    {
        // NOTE: Composite key ChatId, ApplicationUserId, CreatedDateUTC defined in ApplicationDbContext.OnModelCreating
        public string ChatId { get; set; }
        public string ApplicationUserId { get; set; }
        public string Message { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public override dynamic GetServerResponsePayload(ApplicationUser user)
        {
            dynamic obj = new ExpandoObject();
            obj.ChatId = this.Id;
            obj.UpdateHashCode = this.UpdateHashCode;
            obj.UserName = this.ApplicationUser.UserName;
            obj.CreatedDateUTC = this.CreatedDateUTC;
            obj.Message = this.Message;
            return obj;
        }
    }
}
