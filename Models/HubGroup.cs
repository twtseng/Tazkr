using System;
using System.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;
using Microsoft.AspNetCore.SignalR;
using Tazkr.Controllers;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Tazkr.Models
{
    /// <summary>
    /// Base class representing all SignalR clients that are sharing the same Board or Chat or other group-specific app
    /// The clients will listen for HubGroupId to receive messages
    /// </summary>
    public abstract class HubGroup
    {
        public Dictionary<string, ApplicationUser> ApplicationUsers { get; private set; }
        public HubGroup()
        {
            this.HubGroupId = System.Guid.NewGuid().ToString();
            this.ApplicationUsers = new Dictionary<string, ApplicationUser>();
        }
        public string HubGroupId { get; protected set; }

        public virtual async Task JoinGroup(SignalRHub signalRHub, ApplicationUser appUser)
        {
            if (!this.ApplicationUsers.ContainsKey(appUser.Id))
            {
                this.ApplicationUsers[appUser.Id] = appUser;
                await signalRHub.Groups.AddToGroupAsync(signalRHub.Context.ConnectionId, this.HubGroupId);
            }
        }
        public virtual async Task UnjoinGroup(SignalRHub signalRHub, ApplicationUser appUser)
        {
            if (this.ApplicationUsers.ContainsKey(appUser.Id))
            {
                this.ApplicationUsers.Remove(appUser.Id);
                await signalRHub.Groups.RemoveFromGroupAsync(signalRHub.Context.ConnectionId, this.HubGroupId);
            }
        }
        public abstract Task CallAction(SignalRHub signalRHub, ApplicationUser appUser, string hubGroupId, HubPayload hubPayload);
        /// <summary>
        /// True if a game/chat can accept more participants
        /// </summary>
        public abstract bool CanJoin();
    }
}
