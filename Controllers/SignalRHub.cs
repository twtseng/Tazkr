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
        public async Task GetBoards(string accessToken, string unusedField)
        {
            _logger.LogInformation($"=== SignalRHub.GetBoards ===");
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            var boardData = _dbContext.Boards.Include(board => board.CreatedBy)
            .Select(x => new { x.Title, x.BoardId, CreatedBy = x.CreatedBy.UserName });
            await Clients.Caller.SendAsync("RefreshBoards", JsonConvert.SerializeObject(boardData));
        }
        public async Task CreateBoard(string accessToken, string boardTitle)
        {
            _logger.LogInformation($"=== SignalRHub.CreateBoard(title={boardTitle}) ===");
            Board board = new Board();
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            board.CreatedById = appUser.Id;
            board.Title = boardTitle;
            _dbContext.Add(board);
            _dbContext.SaveChanges();
            await this.GetBoards(accessToken, "");
        }
        
        public async Task DeleteBoard(string accessToken, int boardId)
        {
            _logger.LogInformation($"=== SignalRHub.DeleteBoard(boardId={boardId}) ===");
            ApplicationUser appUser = this.GetUserFromAccessToken(accessToken);
            Board board = _dbContext.Boards.Find(boardId);
            _dbContext.Boards.Remove(board);
            _dbContext.SaveChanges();
            await this.GetBoards(accessToken, "");
        }
    }
}
