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
        public List<ApplicationUser> ApplicationUsers { get; set; }
        public AppDataManager()
        {
            this.HubGroups = new List<HubGroup>();
            this.ApplicationUsers = new List<ApplicationUser>();
        }
        public void RefreshHubGroups(SignalRHub signalRHub)
        {
            this.HubGroups = signalRHub.DbContext.Boards.Select(x => (HubGroup) x).ToList();
        }
        public string GetHubGroupsJson()
        {
            return JsonConvert.SerializeObject(
                this.HubGroups.Select(x => new { 
                    x.HubGroupId, 
                    ClassName=x.GetType().Name, 
                    NumUsers=x.ApplicationUsers.Count,
                    Players = x.ApplicationUsers.Select(x => x.UserName).ToList()
                    }));
        }
        public async Task JoinGroup(SignalRHub signalRHub, ApplicationUser appUser, string hubGroupId)
        {
            signalRHub.Logger.LogInformation($"AppDataManager.JoinGroup ({hubGroupId})");
            HubGroup groupToJoin = this.HubGroups.Where(x => x.HubGroupId == hubGroupId).FirstOrDefault();
            if (groupToJoin != null)
            {
                await groupToJoin.JoinGroup(signalRHub, appUser);
            }
        }
        public async Task UnjoinGroup(SignalRHub signalRHub, ApplicationUser appUser, string hubGroupId)
        {
            signalRHub.Logger.LogInformation($"AppDataManager.UnjoinGroup ({hubGroupId})");
            HubGroup groupToUnjoin = this.HubGroups.Where(x => x.HubGroupId == hubGroupId).FirstOrDefault();
            if (groupToUnjoin != null)
            {
                await groupToUnjoin.UnjoinGroup(signalRHub, appUser);
            }
        }
        public async Task GetHubGroups(SignalRHub signalRHub)
        {
            signalRHub.Logger.LogInformation($"AppDataManager.GetHubGroups");
            this.RefreshHubGroups(signalRHub);
            await signalRHub.Clients.Caller.SendAsync("HubGroups", this.GetHubGroupsJson());
        }
        public async Task GetBoards(SignalRHub signalRHub)
        {
            signalRHub.Logger.LogInformation($"AppDataManager.GetBoards");
            this.RefreshHubGroups(signalRHub);
            var boardData = signalRHub.DbContext.Boards
            .Include(board => board.CreatedBy)
            .Select(x => new { x.Title, x.BoardId, CreatedBy = x.CreatedBy.UserName, x.HubGroupId});
            await signalRHub.Clients.Caller.SendAsync("RefreshBoards", JsonConvert.SerializeObject(boardData));  
        }
        public async Task RefreshBoardsForAllClients(SignalRHub signalRHub)
        {
            signalRHub.Logger.LogInformation($"AppDataManager.GetBoards");
            this.RefreshHubGroups(signalRHub);
            var boardData = signalRHub.DbContext.Boards
            .Include(board => board.CreatedBy)
            .Select(x => new { x.Title, x.BoardId, CreatedBy = x.CreatedBy.UserName, x.HubGroupId});
            await signalRHub.Clients.All.SendAsync("RefreshBoards", JsonConvert.SerializeObject(boardData));  
        }
        public async Task CreateBoard(SignalRHub signalRHub, ApplicationUser appUser, string boardTitle)
        {
            signalRHub.Logger.LogInformation($"AppDataManager.CreateBoard");
            Board board = new Board();
            board.CreatedById = appUser.Id;
            board.Title = boardTitle;
            signalRHub.DbContext.Boards.Add(board);
            signalRHub.DbContext.SaveChanges();
            this.RefreshHubGroups(signalRHub);
            await this.RefreshBoardsForAllClients(signalRHub);
        }
        public async Task DeleteBoard(SignalRHub signalRHub, ApplicationUser appUser, string boardId)
        {
            signalRHub.Logger.LogInformation($"AppDataManager.DeleteBoard boardId:{boardId}");
            Board board = signalRHub.DbContext.Boards.Include(x => x.Columns).ThenInclude(x => x.Cards).FirstOrDefault(x => x.BoardId == boardId);
            foreach(Column column in board.Columns)
            {
                foreach(Card card in column.Cards)
                {
                    signalRHub.DbContext.Cards.Remove(card);
                }
                signalRHub.DbContext.Columns.Remove(column);
            }
            signalRHub.DbContext.Boards.Remove(board);
            signalRHub.DbContext.SaveChanges();
            this.RefreshHubGroups(signalRHub);
            await this.RefreshBoardsForAllClients(signalRHub);
        }

        public async Task UpdateUserInCache(SignalRHub signalRHub, ApplicationUser appUser)
        {
            signalRHub.Logger.LogInformation($"AppDataManager.UpdateUserInCache");
            if (!this.ApplicationUsers.Exists(x => x.Id == appUser.Id))
            {
                appUser.LastRequestTime = DateTime.UtcNow;
                this.ApplicationUsers.Add(appUser);
                await this.RefreshCurrentUsers(signalRHub);
            }
            ApplicationUser cachedUser = this.ApplicationUsers.FirstOrDefault(x => x.Id == appUser.Id);
            if (cachedUser != null)
            {
                appUser.LastRequestTime = DateTime.UtcNow;
            }
        }
        public async Task RefreshCurrentUsers(SignalRHub signalRHub)
        {
            signalRHub.Logger.LogInformation($"AppDataManager.RefreshCurrentUsers");
            await signalRHub.Clients.All.SendAsync("RefreshCurrentUsers",
                JsonConvert.SerializeObject(this.ApplicationUsers, Formatting.None,new JsonSerializerSettings(){ReferenceLoopHandling = ReferenceLoopHandling.Ignore}));
        }     
        public async Task CallAction(SignalRHub signalRHub, ApplicationUser appUser, string hubGroupId, HubPayload hubPayload)
        {
            await this.UpdateUserInCache(signalRHub, appUser);

            // If hubGroupId is blank, this is a global action (not group specific)
            if (string.IsNullOrWhiteSpace(hubGroupId))
            {
                switch (hubPayload.Method) {
                    case "GetCurrentUsers":
                        await this.RefreshCurrentUsers(signalRHub);
                        break;
                    case "JoinGroup":
                        await this.JoinGroup(signalRHub, appUser, hubPayload.Param1);
                        break;
                    case "UnjoinGroup":
                        await this.UnjoinGroup(signalRHub, appUser, hubPayload.Param1);
                        break;
                    case "GetHubGroups":
                        await this.GetHubGroups(signalRHub);
                        break;
                    case "GetBoards":
                        await this.GetBoards(signalRHub);
                        break;
                    case "CreateBoard":
                        await this.CreateBoard(signalRHub, appUser, hubPayload.Param1);
                        await this.GetBoards(signalRHub);
                        break;
                    case "DeleteBoard":
                        await this.DeleteBoard(signalRHub, appUser, hubPayload.Param1);
                        await this.GetBoards(signalRHub);
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
