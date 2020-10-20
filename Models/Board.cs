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
        public async Task<string> GetBoardJson(SignalRHub signalRHub)
        {
            Board board = await signalRHub.DbContext.Boards.Include(x => x.BoardUsers).Include(x => x.Columns).ThenInclude(x => x.Cards).FirstOrDefaultAsync();
            return JsonConvert.SerializeObject(board, Formatting.None,new JsonSerializerSettings()
                        { 
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
        }

        public override async Task CallAction(SignalRHub signalRHub, ApplicationUser appUser, string hubGroupId, HubPayload hubPayload)
        {
            switch (hubPayload.Method)
            {
                case "RefreshBoard":
                    signalRHub.Logger.LogInformation($"Board.RefreshBoard");
                    string refreshBoardJson = await this.GetBoardJson(signalRHub);
                    signalRHub.Logger.LogInformation($"Board.RefreshBoard json={refreshBoardJson}");
                    await signalRHub.Clients.Group(this.HubGroupId).SendAsync("BoardJson", refreshBoardJson);
                    break;
                case "GetBoard":
                    signalRHub.Logger.LogInformation($"Board.GetBoard");
                    string getBoardJson = await this.GetBoardJson(signalRHub);
                    signalRHub.Logger.LogInformation($"Board.GetBoard json={getBoardJson}");
                    await signalRHub.Clients.Caller.SendAsync("BoardJson", getBoardJson);
                    break;        
                default:
                    signalRHub.Logger.LogInformation($"Board UNKNOWN METHOD({hubPayload.Method})");
                    break;
            }
        }    

    }
}
