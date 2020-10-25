using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Tazkr.Models;
using Tazkr.Data;

namespace Tazkr.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("[controller]")]    
    public class BoardDataController : ControllerBase
    {
        private readonly ILogger<BoardDataController> _logger;
        private readonly AppDataManager _appDataManager;
        private readonly ApplicationDbContext _dbContext;

        public BoardDataController(ILogger<BoardDataController> logger, AppDataManager appDataManager, ApplicationDbContext dbContext)
        {
            _logger = logger;
            _appDataManager = appDataManager;
            _dbContext = dbContext;
        }

        [HttpGet("GetBoards")]
        public IEnumerable<BoardPayload> GetBoards()
        {
            return _dbContext.Boards
            .Include(board => board.Columns)
            .ThenInclude(col => col.Cards)
            .Select(board => new BoardPayload(board)).ToList();
        }
    }
}
