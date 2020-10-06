using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Tazkr.Models;
using Tazkr.Data;

namespace Tazkr.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class BoardController : ControllerBase
    {

        private readonly ILogger<BoardController> _logger;
        private readonly ApplicationDbContext _dbcontext;

        public BoardController(ILogger<BoardController> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            _dbcontext = dbContext;
        }
        [HttpGet]
        public IEnumerable<Board> GetBoards()
        {
            _logger.LogInformation("=== BoardController.GetBoards ===");
            return _dbcontext.Boards.Include(board => board.CreatedBy);
        }

        [HttpPut]
        public string CreateBoard(Board inputBoard)
        {
            _logger.LogInformation($"=== BoardController.CreateBoard(title={inputBoard.Title}) ===");
            Board board = new Board();
            var userId = this.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ApplicationUser user = _dbcontext.Users.Find(keyValues:userId);
            board.CreatedById = user.Id;

            board.Title = inputBoard.Title;
            _dbcontext.Add(board);
            _dbcontext.SaveChanges();
            return board.ToString();
        }
    }
}
