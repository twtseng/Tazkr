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
    public class SignalRHub : Hub
    {
        private ILogger<SignalRHub> _logger;
        private ApplicationDbContext _dbContext;
        public SignalRHub(ILogger<SignalRHub> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }
        public ApplicationUser GetUserFromAccessToken(string accessToken)
        {
            var handler = new JwtSecurityTokenHandler();
            JwtSecurityToken token = handler.ReadJwtToken(accessToken);
            ApplicationUser appUser = _dbContext.Users.Find(keyValues:token.Subject); 
            return appUser;       
        }
        public async Task GetBoards(string accessToken)
        {
            _logger.LogInformation($"=== SignalRHub.GetBoards ===");
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            var boardData = _dbContext.Boards
            .Include(board => board.CreatedBy)
            .Select(x => new { x.Title, x.BoardId, CreatedBy = x.CreatedBy.UserName});
            await Clients.Caller.SendAsync("RefreshBoards", JsonConvert.SerializeObject(boardData));
        }
        public async Task GetBoardsWithContents(string accessToken)
        {
            _logger.LogInformation($"=== SignalRHub.GetBoardsWithContents ===");
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            var boardData = _dbContext.Boards
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
            await Clients.Caller.SendAsync("RefreshBoardsWithContents", JsonConvert.SerializeObject(boardData));
        }
        public async Task CreateBoard(string accessToken, string boardTitle)
        {
            _logger.LogInformation($"=== SignalRHub.CreateBoard(title={boardTitle}) ===");
            Board board = new Board();
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            board.CreatedById = appUser.Id;
            board.Title = boardTitle;
            _dbContext.Boards.Add(board);
            _dbContext.SaveChanges();
            await this.GetBoards(accessToken);
        }
        
        public async Task DeleteBoard(string accessToken, int boardId)
        {
            _logger.LogInformation($"=== SignalRHub.DeleteBoard(boardId={boardId}) ===");
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            Board board = _dbContext.Boards.Find(boardId);
            _dbContext.Boards.Remove(board);
            _dbContext.SaveChanges();
            await this.GetBoards(accessToken);
        }
        public async Task RenameBoard(string accessToken, int boardId, string newName)
        {
            _logger.LogInformation($"=== SignalRHub.RenameBoard(boardId={boardId}, newName={newName}) ===");
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            Board board = _dbContext.Boards.Find(boardId);
            board.Title = newName;
            _dbContext.Boards.Update(board);
            _dbContext.SaveChanges();
            await this.GetBoards(accessToken);
        }
        public async Task AddColumnToBoard(string accessToken, int boardId)
        {
            _logger.LogInformation($"=== SignalRHub.AddTaskToBoard(boardId={boardId}) ===");
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            Column column = new Column();
            column.Title = "New Column";
            column.BoardId = boardId;
            _dbContext.Columns.Add(column);
            _dbContext.SaveChanges();
            await this.GetBoards(accessToken);
        }
        public async Task DeleteColumn(string accessToken, int columnId)
        {
            _logger.LogInformation($"=== SignalRHub.DeleteColumn(columnId={columnId}) ===");
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            Column column = _dbContext.Columns.Find(columnId);
            _dbContext.Columns.Remove(column);
            _dbContext.SaveChanges();
            await this.GetBoards(accessToken);
        }
        public async Task AddCardToColumn(string accessToken, int columnId)
        {
            _logger.LogInformation($"=== SignalRHub.AddCardToColumn(columnId={columnId}) ===");
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            Card card = new Card();
            card.Title = "New Card";
            card.ColumnId = columnId;
            _dbContext.Cards.Add(card);
            _dbContext.SaveChanges();
            await this.GetBoards(accessToken);
        }
        public async Task DeleteCard(string accessToken, int cardId)
        {
            _logger.LogInformation($"=== SignalRHub.DeleteCard(cardId={cardId}) ===");
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            Card card = _dbContext.Cards.Find(cardId);
            _dbContext.Cards.Remove(card);
            _dbContext.SaveChanges();
            await this.GetBoards(accessToken);
        }
    }
}
