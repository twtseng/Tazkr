using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;
using Tazkr.Models;
using Tazkr.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Newtonsoft.Json;

namespace Tazkr.Controllers
{
    /// <summary>
    /// SignalR Hub for receiving and sending data to and from clientapp
    /// All client requests come through CallAction method, which is processed by AppDataManager class
    /// </summary>
    public class SignalRHub : Hub
    {
        public ILogger<SignalRHub> Logger { get; private set; }
        public ApplicationDbContext DbContext  { get; private set; }
        public SignalRHub(ILogger<SignalRHub> logger, ApplicationDbContext dbContext)
        {
            this.Logger = logger;
            this.DbContext = dbContext;
        }
        public void CallAction(string accessToken, string hubGroupId, string payloadString)
        {
            Logger.LogInformation($"SignalRHub.CallAction groupId=[{hubGroupId}] payload=[{payloadString}]");
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            HubPayload hubPayload = JsonConvert.DeserializeObject<HubPayload>(payloadString);
            // await _appDataManager.CallAction(this, appUser, hubGroupId, hubPayload);
        }
        public ApplicationUser GetUserFromAccessToken(string accessToken)
        {
            var handler = new JwtSecurityTokenHandler();
            JwtSecurityToken token = handler.ReadJwtToken(accessToken);
            ApplicationUser appUser = DbContext.Users.Find(keyValues:token.Subject); 
            return appUser;       
        }
        public override async Task OnConnectedAsync()
        {
            // Add your own code here.
            // For example: in a chat application, record the association between
            // the current connection ID and user name, and mark the user as online.
            // After the code in this method completes, the client is informed that
            // the connection is established; for example, in a JavaScript client,
            // the start().done callback is executed.
            Logger.LogInformation($"=== SignalRHub.OnConnectedAsync ===");
            await base.OnConnectedAsync();
            await Clients.Caller.SendAsync("ServerMessage", "FOO","This is my message from the server");
            List<dynamic> users = this.DbContext.Users.Select(x => x.GetServerResponsePayload()).ToList();
            await Clients.Caller.SendAsync("ServerMessage", "UpdateAppUsers", users);
        }
        // public async Task GetBoards(string accessToken)
        // {
        //     Logger.LogInformation($"=== SignalRHub.GetBoards ===");
        //     ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
        //     var boardData = DbContext.Boards
        //     .Include(board => board.CreatedBy)
        //     .Select(x => new { x.Title, x.BoardId, CreatedBy = x.CreatedBy.UserName});
        //     await Clients.Caller.SendAsync("RefreshBoards", JsonConvert.SerializeObject(boardData));
        // }
        // public async Task GetBoardsWithContents(string accessToken)
        // {
        //     Logger.LogInformation($"=== SignalRHub.GetBoardsWithContents ===");
        //     ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
        //     var boardData = DbContext.Boards
        //     .Include(board => board.CreatedBy)
        //     .Include(board => board.Columns)
        //     .ThenInclude(column => column.Cards)
        //     .Select(x => new 
        //         { x.Title, x.BoardId, CreatedBy = x.CreatedBy.UserName,
        //             Columns = x.Columns.Select(col => new 
        //             {
        //                 col.ColumnId,
        //                 col.Title,
        //                 Cards = col.Cards.Select(card => new { card.CardId, card.Title })
        //             })  
        //         });
        //     await Clients.Caller.SendAsync("RefreshBoardsWithContents", JsonConvert.SerializeObject(boardData));
        // }
        // public async Task CreateBoard(string accessToken, string boardTitle)
        // {
        //     Logger.LogInformation($"=== SignalRHub.CreateBoard(title={boardTitle}) ===");
        //     Board board = new Board();
        //     ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
        //     board.CreatedById = appUser.Id;
        //     board.Title = boardTitle;
        //     DbContext.Boards.Add(board);
        //     DbContext.SaveChanges();
        //     await this.GetBoardsWithContents(accessToken);
        // }
        
        // public async Task DeleteBoard(string accessToken, int boardId)
        // {
        //     Logger.LogInformation($"=== SignalRHub.DeleteBoard(boardId={boardId}) ===");
        //     ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
        //     Board board = DbContext.Boards.Find(boardId);
        //     DbContext.Boards.Remove(board);
        //     DbContext.SaveChanges();
        //     await this.GetBoardsWithContents(accessToken);
        // }
        // public async Task RenameBoard(string accessToken, int boardId, string newName)
        // {
        //     Logger.LogInformation($"=== SignalRHub.RenameBoard(boardId={boardId}, newName={newName}) ===");
        //     ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
        //     Board board = DbContext.Boards.Find(boardId);
        //     board.Title = newName;
        //     DbContext.Boards.Update(board);
        //     DbContext.SaveChanges();
        //     await this.GetBoards(accessToken);
        // }
        // public async Task AddColumnToBoard(string accessToken, int boardId)
        // {
        //     Logger.LogInformation($"=== SignalRHub.AddTaskToBoard(boardId={boardId}) ===");
        //     ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
        //     Column column = new Column();
        //     column.Title = "New Column";
        //     column.BoardId = boardId;
        //     DbContext.Columns.Add(column);
        //     DbContext.SaveChanges();
        //     await this.GetBoardsWithContents(accessToken);
        // }
        // public async Task DeleteColumn(string accessToken, int columnId)
        // {
        //     Logger.LogInformation($"=== SignalRHub.DeleteColumn(columnId={columnId}) ===");
        //     ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
        //     Column column = DbContext.Columns.Find(columnId);
        //     DbContext.Columns.Remove(column);
        //     DbContext.SaveChanges();
        //     await this.GetBoards(accessToken);
        // }
        // public async Task AddCardToColumn(string accessToken, int columnId)
        // {
        //     Logger.LogInformation($"=== SignalRHub.AddCardToColumn(columnId={columnId}) ===");
        //     ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
        //     Card card = new Card();
        //     card.Title = "New Card";
        //     card.ColumnId = columnId;
        //     DbContext.Cards.Add(card);
        //     DbContext.SaveChanges();
        //     await this.GetBoardsWithContents(accessToken);
        // }
        // public async Task DeleteCard(string accessToken, int cardId)
        // {
        //     Logger.LogInformation($"=== SignalRHub.DeleteCard(cardId={cardId}) ===");
        //     ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
        //     Card card = DbContext.Cards.Find(cardId);
        //     DbContext.Cards.Remove(card);
        //     DbContext.SaveChanges();
        //     await this.GetBoardsWithContents(accessToken);
        // }
    }
}
