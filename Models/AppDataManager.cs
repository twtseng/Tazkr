using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tazkr.Controllers;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace Tazkr.Models
{
    /// <summary>
    /// Application data will be modified through this class
    /// </summary>
    public class AppDataManager
    {
        public List<HubGroup> HubGroups { get; set; }
        public AppDataManager()
        {
            this.HubGroups = new List<HubGroup>();
        }
        public string GetHubGroupsJson()
        {
            return JsonConvert.SerializeObject(
                this.HubGroups.Select(x => new { 
                    x.HubGroupId, 
                    ClassName=x.GetType().Name, 
                    CanJoin = x.CanJoin(), 
                    NumUsers=x.ApplicationUsers.Keys.Count,
                    Players = x.ApplicationUsers.Values.Select(x => x.UserName).ToList()
                    }));
        }
        public async Task CallAction(SignalRHub signalRHub, ApplicationUser appUser, string hubGroupId, HubPayload hubPayload)
        {
            // If hubGroupId is blank, this is a global action (not group specific)
            if (string.IsNullOrWhiteSpace(hubGroupId))
            {
                switch (hubPayload.Method) {
                    case "JoinGroup":
                        signalRHub.Logger.LogInformation($"AppDataManager.JoinGroup ({hubPayload.Param1})");
                        HubGroup groupToJoin = this.HubGroups.Where(x => x.HubGroupId == hubPayload.Param1).FirstOrDefault();
                        if (groupToJoin != null)
                        {
                            await groupToJoin.JoinGroup(signalRHub, appUser);
                        }
                        break;
                    case "UnjoinGroup":
                        signalRHub.Logger.LogInformation($"AppDataManager.UnjoinGroup ({hubPayload.Param1})");
                        HubGroup groupToUnjoin = this.HubGroups.Where(x => x.HubGroupId == hubPayload.Param1).FirstOrDefault();
                        if (groupToUnjoin != null)
                        {
                            await groupToUnjoin.UnjoinGroup(signalRHub, appUser);
                        }
                        break;
                    case "GetHubGroups":
                        signalRHub.Logger.LogInformation($"AppDataManager.GetHubGroups ({hubPayload.Param1})");
                        await signalRHub.Clients.Caller.SendAsync("HubGroups", this.GetHubGroupsJson());
                        break;
                    case "GetBoards":
                        signalRHub.Logger.LogInformation($"AppDataManager.GetBoards");
                        var boardData = signalRHub.DbContext.Boards
                        .Include(board => board.CreatedBy)
                        .Select(x => new { x.Title, x.BoardId, CreatedBy = x.CreatedBy.UserName});
                        await signalRHub.Clients.Caller.SendAsync("RefreshBoards", JsonConvert.SerializeObject(boardData));  
                        break;
                    case "GetBoardsWithContents":
                        signalRHub.Logger.LogInformation($"=== AppDataManager.GetBoardsWithContents ===");
                        var boardDataWithContents = signalRHub.DbContext.Boards
                        .Include(board => board.CreatedBy)
                        .Include(board => board.Columns)
                        .ThenInclude(column => column.Cards)
                        .Select(x => new 
                            { x.Title, x.BoardId, CreatedBy = x.CreatedBy.UserName,
                                Columns = x.Columns.Select(col => new 
                                {
                                    col.ColumnId,
                                    col.Title,
                                    Cards = col.Cards.Select(card => new { card.CardId, card.Title })
                                })  
                            });
                        await signalRHub.Clients.Caller.SendAsync("RefreshBoardsWithContents", JsonConvert.SerializeObject(boardDataWithContents));
                        break;
                    case "CreateBoard":
                        signalRHub.Logger.LogInformation($"AppDataManager.CreateBoard");
                        Board board = new Board();
                        board.CreatedById = appUser.Id;
                        board.Title = hubPayload.Param1;
                        signalRHub.DbContext.Boards.Add(board);
                        signalRHub.DbContext.SaveChanges();
                        await this.CallAction(signalRHub, appUser, "", new HubPayload() { Method="GetBoardsWithContents" }); 
                        break;
                }
            }
            else // Handle group (board or chatroom) specific action
            {
                foreach(HubGroup group in this.HubGroups)
                {
                    if (hubGroupId == group.HubGroupId)
                    {
                        await group.CallAction(signalRHub, appUser, hubGroupId, hubPayload);
                    }
                }
            }
        }
    }
}
