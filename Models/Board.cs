using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Tazkr.Controllers;

namespace Tazkr.Models
{
    public class Board : HubGroup
    {
        public Board() : base()
        {
            
        }
        [Key]
        public int BoardId { get; set; }
        public string Title { get; set; }

        public string CreatedById { get; set; }
        [InverseProperty("BoardsCreated")]
        public ApplicationUser CreatedBy { get; set; }
        public List<BoardUser> BoardUsers { get; set; }
        public List<Column> Columns { get; set; }
        public string GetBoardJson()
        {
            return JsonConvert.SerializeObject(this);
        }

        public override async Task CallAction(SignalRHub signalRHub, ApplicationUser appUser, string hubGroupId, HubPayload hubPayload)
        {
            switch (hubPayload.Method)
            {
                case "RefreshBoard":
                    signalRHub.Logger.LogInformation($"Board.RefreshBoard");
                    await this.JoinGroup(signalRHub, appUser);
                    await signalRHub.Clients.Group(this.HubGroupId).SendAsync("BoardJson", this.GetBoardJson());
                    break;
                case "GetBoard":
                    signalRHub.Logger.LogInformation($"Board.GetBoard");
                    await this.JoinGroup(signalRHub, appUser);
                    await signalRHub.Clients.Caller.SendAsync("BoardJson", this.GetBoardJson());
                    break;        
                default:
                    signalRHub.Logger.LogInformation($"Board UNKNOWN METHOD({hubPayload.Method})");
                    break;
            }
        }    

    }
}
