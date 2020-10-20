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
            Board board = await signalRHub.DbContext.Boards.Include(x => x.BoardUsers).Include(x => x.Columns).ThenInclude(x => x.Cards).FirstOrDefaultAsync(x => x.BoardId == this.BoardId);
            return JsonConvert.SerializeObject(board, Formatting.None,new JsonSerializerSettings(){ReferenceLoopHandling = ReferenceLoopHandling.Ignore});
        }
        public async Task AddColumn(SignalRHub signalRHub, string columnTitle)
        {
            signalRHub.Logger.LogInformation($"Board.AddColumn columnTitle={columnTitle}");
            Column column = new Column();
            column.BoardId = this.BoardId;
            column.Title = columnTitle;
            signalRHub.DbContext.Columns.Add(column);
            await signalRHub.DbContext.SaveChangesAsync();
        }
        public async Task AddCardToColumn(SignalRHub signalRHub, int columnId)
        {
            signalRHub.Logger.LogInformation($"Board.AddCardToColumn columnId={columnId}");
            Card card = new Card();
            card.ColumnId = columnId;
            card.Title = "New Task";
            signalRHub.DbContext.Cards.Add(card);
            await signalRHub.DbContext.SaveChangesAsync();
        }
        public override async Task CallAction(SignalRHub signalRHub, ApplicationUser appUser, string hubGroupId, HubPayload hubPayload)
        {
            switch (hubPayload.Method)
            {
                case "RefreshBoard":
                    signalRHub.Logger.LogInformation($"Board.RefreshBoard");
                    await signalRHub.Clients.Group(this.HubGroupId).SendAsync("BoardJson", await this.GetBoardJson(signalRHub));
                    break;
                case "GetBoard":
                    signalRHub.Logger.LogInformation($"Board.GetBoard");
                    await signalRHub.Clients.Caller.SendAsync("BoardJson", await this.GetBoardJson(signalRHub));
                    break;
                case "AddColumn":
                    signalRHub.Logger.LogInformation($"Board.AddColumn({ hubPayload.Param1})");
                    await this.AddColumn(signalRHub, hubPayload.Param1);
                    await signalRHub.Clients.Group(this.HubGroupId).SendAsync("BoardJson", await this.GetBoardJson(signalRHub));
                    break;
                case "AddCardToColumn":
                    signalRHub.Logger.LogInformation($"Board.AddCardToColumn({ hubPayload.Param1})");
                    await this.AddCardToColumn(signalRHub, int.Parse(hubPayload.Param1));
                    await signalRHub.Clients.Group(this.HubGroupId).SendAsync("BoardJson", await this.GetBoardJson(signalRHub));
                    break;    
                case "JoinBoard":
                    signalRHub.Logger.LogInformation($"Board.JoinBoard({appUser.Email})");
                    await base.JoinGroup(signalRHub, appUser);
                    // TODO: Add this user to BoardUsers?
                    break;              
                default:
                    signalRHub.Logger.LogInformation($"Board UNKNOWN METHOD({hubPayload.Method})");
                    break;
            }
        }    

    }
}
