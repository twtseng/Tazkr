using System;
using System.Linq;
using System.Dynamic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Tazkr.Models;
using Tazkr.Data;

namespace Tazkr.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]    
    public class BoardDataController : ControllerBase
    {
        private readonly ILogger<BoardDataController> _logger;
        private readonly ApplicationDbContext _dbContext;
        private readonly IHubContext<SignalRHub> _signalRHub;

        public ApplicationUser GetApplicationUser()
        {
            string userId = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            ApplicationUser appUser = _dbContext.Users.Find(userId);
            appUser.LastRequestTimeUTC = DateTime.UtcNow;
            _dbContext.Users.Update(appUser);
            _dbContext.SaveChanges();
            return appUser;       
        }
        public Board.PermissionLevels GetUserPermissionLevelForBoard(string boardId, ApplicationUser user)
        {
            Board board = _dbContext.Boards
            .Include(board => board.BoardUsers)
            .ThenInclude(user => user.ApplicationUser)
            .Where(board => board.Id == boardId)
            .FirstOrDefault();
            return board.GetPermissionLevelForUser(user);
        }
        public BoardDataController(ILogger<BoardDataController> logger, ApplicationDbContext dbContext, IHubContext<SignalRHub> signalRHub)
        {
            _logger = logger;
            _dbContext = dbContext;
            _signalRHub = signalRHub;
        }
        /// <summary>
        /// Get list of minimum board data for displaying the list of boards (no column and card data)
        /// </summary>
        [HttpGet("Boards")]
        public IEnumerable<Object> GetBoards()
        {
            ApplicationUser user = this.GetApplicationUser();
            List<Board> unfilteredBoards = _dbContext.Boards
            .Include(board => board.BoardUsers)
            .ThenInclude(user => user.ApplicationUser)
            .Include(board => board.CreatedBy)
            .ToList();
            return unfilteredBoards.Where(board => board.GetPermissionLevelForUser(user) != Board.PermissionLevels.None)
            .Select(board => board.GetMinimumServerResponsePayload(user)).ToList();
        }
        /// <summary>
        /// Get full data for a single board
        /// </summary>
        [HttpGet("Boards/{boardId}")]
        public Object GetBoard(string boardId)
        {
            ApplicationUser user = this.GetApplicationUser();
            _logger.LogInformation($"BoardDataController.GetBoard({boardId})");
            Board board = _dbContext.Boards
            .Include(board => board.BoardUsers)
            .ThenInclude(user => user.ApplicationUser)
            .Include(board => board.CreatedBy)
            .Include(board => board.Columns)
            .ThenInclude(col => col.Cards)
            .Where(board => board.Id == boardId)
            .FirstOrDefault();

            return board.GetServerResponsePayload(user);
        }

        [HttpPost("Boards")]
        public IActionResult CreateBoard(ClientRequestPayload payload)
        {
            string boardTitle = payload.Param1;
            try
            {
                ApplicationUser user = this.GetApplicationUser();
                Board board = new Board();
                board.CreatedById = user.Id;
                board.Title = boardTitle;
                _dbContext.Boards.Add(board);
                Column column = new Column();
                column.BoardId = board.Id;
                column.Title = "New Column";
                _dbContext.Columns.Add(column);
                _dbContext.SaveChangesForUser(user);
                _signalRHub.Clients.All.SendAsync("ServerMessage","BoardsUpdated");
                string status = $"BoardDataController.CreateBoard(boardTitle={boardTitle}), boardId:{board.Id}";
                _logger.LogInformation(status);
                return new OkObjectResult(new {status});
            }
            catch (Exception ex)
            {
                string exceptionString = $"BoardDataController.CreateBoard(boardTitle={boardTitle}) exception occurred: {ex.ToString()}";
                _logger.LogInformation(exceptionString);
                return BadRequest(new {status=exceptionString});
            }
        }
        [HttpDelete("Boards/{boardId}")]
        public IActionResult DeleteBoard(string boardId)
        {
            Board board = _dbContext.Boards.Include(x => x.Columns).ThenInclude(x => x.Cards).FirstOrDefault(x => x.Id == boardId);
            ApplicationUser user = this.GetApplicationUser();
            if (board == null) 
            {
                string errorString = $"BoardDataController.DeleteBoard Board NOT found with boardId:{boardId}";
                _logger.LogInformation(errorString);
                return BadRequest(new {status=errorString});
            }
            else if (board.CreatedById != user.Id)
            {
                string errorString = $"BoardDataController.DeleteBoard User does not have permission to delete board:{boardId}";
                _logger.LogInformation(errorString);
                return Unauthorized(new {status=errorString});                
            }
            else
            {
                try
                {
                    foreach(Column column in board.Columns)
                    {
                        foreach(Card card in column.Cards)
                        {
                            _dbContext.Cards.Remove(card);
                        }
                        _dbContext.Columns.Remove(column);
                    }
                    _dbContext.Boards.Remove(board);
                    _dbContext.SaveChangesForUser(user);
                    _signalRHub.Clients.All.SendAsync("ServerMessage","BoardsUpdated");
                    string status = $"BoardDataController.DeleteBoard Deleted board with boardId:{boardId}";
                    _logger.LogInformation(status);
                    return new OkObjectResult(new {status});
                }
                catch (Exception ex)
                {
                    string exceptionString = $"BoardDataController.DeleteBoard(boardId:{boardId}) exception occurred: {ex.ToString()}";
                    _logger.LogInformation(exceptionString);
                    return BadRequest(new {status=exceptionString});
                }
            }
        }
        [HttpPut("Boards/{boardId}/Title")]
        public IActionResult RenameBoard(string boardId, ClientRequestPayload payload)        
        {
            string newName = payload.Param1;
            try
            {
                ApplicationUser user = this.GetApplicationUser();
                if (GetUserPermissionLevelForBoard(boardId, user) != Board.PermissionLevels.Owner)
                {
                    string errorString = $"BoardDataController.RenameBoard(boardId:{boardId}) by user {user.UserName} access denied";
                     _logger.LogInformation(errorString);
                    return this.Unauthorized(new {status=errorString});
                }
                Board board = _dbContext.Boards.Find(boardId);
                string status = $"BoardDataController.RenameBoard(boardId:{boardId}), newName={newName}";
                board.Title = newName;
                _dbContext.Boards.Update(board);
                _dbContext.SaveChangesForUser(user);
                _signalRHub.Clients.All.SendAsync("ServerMessage","BoardsUpdated");
                _signalRHub.Clients.Group(boardId).SendAsync("ServerMessage","BoardUpdated");
                _logger.LogInformation(status);
                return new OkObjectResult(new {status});
            }
            catch (Exception ex)
            {
                string exceptionString = $"BoardDataController.RenameBoard(boardId:{boardId}, newName={newName}) exception occurred: {ex.ToString()}";
                _logger.LogInformation(exceptionString);
                return BadRequest(new {status=exceptionString});
            }
        }
        [HttpPut("Boards/{boardId}/IsPubliclyVisible")]
        public IActionResult SetBoardPublicVisibility(string boardId, ClientRequestPayload payload)        
        {
            try
            {
                bool isPubliclyVisible = bool.Parse(payload.Param1);
                ApplicationUser user = this.GetApplicationUser();
                if (GetUserPermissionLevelForBoard(boardId, user) != Board.PermissionLevels.Owner)
                {
                    string errorString = $"BoardDataController.SetBoardPublicVisibility(boardId:{boardId}) by user {user.UserName} access denied";
                     _logger.LogInformation(errorString);
                    return this.Unauthorized(new {status=errorString});
                }
                Board board = _dbContext.Boards.Find(boardId);
                string status = $"BoardDataController.SetBoardPublicVisibility(boardId:{boardId}), isPubliclyVisible={payload.Param1}";
                board.IsPubliclyVisible = isPubliclyVisible;
                _dbContext.Boards.Update(board);
                _dbContext.SaveChangesForUser(user);
                _signalRHub.Clients.All.SendAsync("ServerMessage","BoardsUpdated");
                _signalRHub.Clients.Group(boardId).SendAsync("ServerMessage","BoardUpdated");
                _logger.LogInformation(status);
                return new OkObjectResult(new {status});
            }
            catch (Exception ex)
            {
                string exceptionString = $"BoardDataController.SetBoardPublicVisibility(boardId:{boardId}, isPubliclyVisible={payload.Param1}) exception occurred: {ex.ToString()}";
                _logger.LogInformation(exceptionString);
                return BadRequest(new {status=exceptionString});
            }
        }
        [HttpPost("Columns")]
        public IActionResult AddColumnToBoard(ClientRequestPayload payload)
        {
            string boardId = payload.Param1;
            string columnTitle = payload.Param2;
            try
            {
                ApplicationUser user = this.GetApplicationUser();
                Column column = new Column();
                column.BoardId = boardId;
                column.Title = columnTitle;

                // Set index to the next highest index for this Board, or 0 if this is the first column
                List<Column> columns = _dbContext.Boards.Include(x => x.Columns).FirstOrDefault(x => x.Id == column.BoardId).Columns.ToList();
                column.Index = columns.Count > 0 ? columns.Max(col => col.Index) + 1 : 0;

                _dbContext.Columns.Add(column);
                _dbContext.SaveChangesForUser(user);
                string status = $"BoardDataController.AddColumnToBoard BoardId={boardId}, Title={columnTitle}";
                _signalRHub.Clients.Group(boardId).SendAsync("ServerMessage","BoardUpdated");
                _logger.LogInformation(status);
                return new OkObjectResult(new {status});
            }
            catch (Exception ex)
            {
                string exceptionString = $"BoardDataController.AddColumnToBoard BoardId={boardId}, Title={columnTitle} exception occurred: {ex.ToString()}";
                _logger.LogInformation(exceptionString);
                return BadRequest(new {status=exceptionString});
            }            
        }
        [HttpDelete("Columns/{columnId}")]
        public IActionResult DeleteColumn(string columnId)
        {
            Column column = _dbContext.Columns.Include(x => x.Cards).FirstOrDefault(x => x.Id == columnId);
            if (column == null) 
            {
                string errorString = $"BoardDataController.DeleteColumn Column NOT found with ColumnId:{columnId}";
                _logger.LogInformation(errorString);
                return BadRequest(new {status=errorString});
            }
            else
            {
                try
                {
                    ApplicationUser user = this.GetApplicationUser();
                    if (GetUserPermissionLevelForBoard(column.BoardId, user) != Board.PermissionLevels.Owner)
                    {
                        string errorString = $"BoardDataController.DeleteColumn(columnId:{columnId}) by user {user.UserName} access denied";
                        _logger.LogInformation(errorString);
                        return this.Unauthorized(new {status=errorString});
                    }
                    string boardId = column.BoardId;
                    foreach(Card card in column.Cards)
                    {
                        _dbContext.Cards.Remove(card);
                    }
                    _dbContext.Columns.Remove(column);
                    _dbContext.SaveChangesForUser(user);
                    _signalRHub.Clients.Group(boardId).SendAsync("ServerMessage","BoardUpdated");
                    string status = $"BoardDataController.DeleteColumn Deleted column with columnId:{columnId}";
                    _logger.LogInformation(status);
                    return new OkObjectResult(new {status});
                }
                catch (Exception ex)
                {
                    string exceptionString = $"BoardDataController.DeleteColumn(columnId:{columnId}) exception occurred: {ex.ToString()}";
                    _logger.LogInformation(exceptionString);
                    return BadRequest(new {status=exceptionString});
                }
            }
        }
        [HttpPut("Columns/{columnId}/Title")]
        public IActionResult RenameColumn(string columnId, ClientRequestPayload payload)
        {
            string newName = payload.Param1;
            try
            {
                ApplicationUser user = this.GetApplicationUser();
                Column column = _dbContext.Columns.Find(columnId);
                Board.PermissionLevels permLevel = GetUserPermissionLevelForBoard(column.BoardId, user);
                if (permLevel != Board.PermissionLevels.Owner && permLevel != Board.PermissionLevels.User)
                {
                    string errorString = $"BoardDataController.RenameColumn(columnId:{columnId}) by user {user.UserName} access denied";
                    _logger.LogInformation(errorString);
                    return this.Unauthorized(new {status=errorString});
                }
                column.Title = newName;
                _dbContext.Columns.Update(column);
                _dbContext.SaveChangesForUser(user);
                _signalRHub.Clients.Group(column.BoardId).SendAsync("ServerMessage","BoardUpdated");
                string status = $"BoardDataController.RenameColumn columnId={columnId}, newName={newName}";
                _logger.LogInformation(status);
                return new OkObjectResult(new {status});
            }
            catch (Exception ex)
            {
                string exceptionString = $"BoardDataController.RenameColumn columnId={columnId}, newName={newName} exception occurred: {ex.ToString()}";
                _logger.LogInformation(exceptionString);
                return BadRequest(new {status=exceptionString});
            }
        }
        [HttpPost("Cards")]
        public IActionResult AddCardToColumn(ClientRequestPayload payload)
        {
            string columnId = payload.Param1;
            string cardTitle = payload.Param2;
            string boardId = payload.Param3;
            try
            {
                ApplicationUser user = this.GetApplicationUser();
                Board.PermissionLevels permLevel = GetUserPermissionLevelForBoard(boardId, user);
                if (permLevel != Board.PermissionLevels.Owner && permLevel != Board.PermissionLevels.User)
                {
                    string errorString = $"BoardDataController.AddCardToColumn(columnId:{columnId}) by user {user.UserName} access denied";
                    _logger.LogInformation(errorString);
                    return this.Unauthorized(new {status=errorString});
                }
                List<Card> cards = _dbContext.Columns.Include(x => x.Cards).FirstOrDefault(x => x.Id == columnId).Cards.ToList();
                Card card = new Card();
                card.Title = cardTitle;
                card.Index = cards.Count > 0 ? cards.Max(col => col.Index) + 1 : 0;
                card.ColumnId = columnId;
                _dbContext.Cards.Add(card);
                _dbContext.SaveChangesForUser(user);
                _signalRHub.Clients.Group(boardId).SendAsync("ServerMessage","BoardUpdated");
                string status = $"BoardDataController.AddCardToColumn(columnId={columnId}), cardId:{card.Id}";
                _logger.LogInformation(status);
                return new OkObjectResult(new {status});
            }
            catch (Exception ex)
            {
                string exceptionString = $"BoardDataController.AddCardToColumn(columnId={columnId}) exception occurred: {ex.ToString()}";
                _logger.LogInformation(exceptionString);
                return BadRequest(new {status=exceptionString});
            }
        }
        [HttpPut("Cards/{columnId}/{cardId}/{index}")]
        public IActionResult MoveCardToColumnAtIndex(string columnId, string cardId, int index)
        {
            try
            {
                ApplicationUser user = this.GetApplicationUser();
                Column column = _dbContext.Columns.Include(x => x.Cards).FirstOrDefault(x => x.Id == columnId);
                Board.PermissionLevels permLevel = GetUserPermissionLevelForBoard(column.BoardId, user);
                if (permLevel != Board.PermissionLevels.Owner && permLevel != Board.PermissionLevels.User)
                {
                    string errorString = $"BoardDataController.MoveCardToColumnAtIndex(columnId:{columnId}) by user {user.UserName} access denied";
                    _logger.LogInformation(errorString);
                    return this.Unauthorized(new {status=errorString});
                }
                List<Card> cards = column.Cards.OrderBy(x => x.Index).ToList();
                // First remove the target card from list (if it exists)
                int existingIndex = -1;
                for(int i=0; i < cards.Count; ++i)
                {
                    if (cards[i].Id == cardId)
                    {
                        existingIndex = i;
                    }
                }
                if (existingIndex > -1)
                {
                    cards.RemoveAt(existingIndex);
                }
                // Update the indexes with card in new position
                for(int i=0; i < cards.Count; ++i)
                {
                    cards[i].Index = i >= index ? i + 1 : i;
                    _dbContext.Cards.Update(cards[i]);
                }
                Card cardToMove = _dbContext.Cards.Find(cardId);
                cardToMove.ColumnId = columnId;
                cardToMove.Index = index;
                _dbContext.Cards.Update(cardToMove);
                _dbContext.SaveChangesForUser(user);
                _signalRHub.Clients.Group(column.BoardId).SendAsync("ServerMessage","BoardUpdated");
                string status = $"BoardDataController.MoveCardToColumnAtIndex cardId={cardId}, columnId={columnId}, index={index}";
                _logger.LogInformation(status);
                return new OkObjectResult(new {status});
            }
            catch (Exception ex)
            {
                string exceptionString = $"BoardDataController.MoveCardToColumnAtIndex cardId={cardId}, columnId={columnId}, index={index} exception occurred: {ex.ToString()}";
                _logger.LogInformation(exceptionString);
                return BadRequest(new {status=exceptionString});
            }
        }
        [HttpPatch("Cards/{cardId}")]
        public IActionResult UpdateCard(string cardId, ClientRequestPayload payload)
        {
            string boardId = payload.Param3;
            try
            {
                ApplicationUser user = this.GetApplicationUser();
                Board.PermissionLevels permLevel = GetUserPermissionLevelForBoard(boardId, user);
                if (permLevel != Board.PermissionLevels.Owner && permLevel != Board.PermissionLevels.User)
                {
                    string errorString = $"BoardDataController.UpdateCard(boardId:{boardId}) by user {user.UserName} access denied";
                    _logger.LogInformation(errorString);
                    return this.Unauthorized(new {status=errorString});
                }
                Card card = _dbContext.Cards.Find(cardId);
                if (payload.Param1 != null)
                {
                     _logger.LogInformation($"BoardDataController.UpdateCard setting Title to {payload.Param1}");
                    card.Title = payload.Param1;
                }
                if (payload.Param2 != null)
                {
                    _logger.LogInformation($"BoardDataController.UpdateCard setting Description to {payload.Param2}");
                    card.Description = payload.Param2;
                }         
                _dbContext.Cards.Update(card);
                _dbContext.SaveChangesForUser(user);
                _signalRHub.Clients.Group(boardId).SendAsync("ServerMessage","BoardUpdated");
                string status = $"BoardDataController.UpdateCard cardId={cardId}";
                _logger.LogInformation(status);
                return new OkObjectResult(new {status});
            }
            catch (Exception ex)
            {
                string exceptionString = $"BoardDataController.UpdateCard cardId={cardId},  exception occurred: {ex.ToString()}";
                _logger.LogInformation(exceptionString);
                return BadRequest(new {status=exceptionString});                
            }
        }
        [HttpDelete("Cards/{cardId}")]
        public IActionResult DeleteCard(string cardId, ClientRequestPayload payload)
        {
            string boardId = payload.Param1;
            try
            {
                ApplicationUser user = this.GetApplicationUser();
                Board.PermissionLevels permLevel = GetUserPermissionLevelForBoard(boardId, user);
                if (permLevel != Board.PermissionLevels.Owner)
                //if (permLevel != Board.PermissionLevels.Owner && permLevel != Board.PermissionLevels.User)
                {
                    string errorString = $"BoardDataController.DeleteCard(boardId:{boardId}) by user {user.UserName} access denied";
                    _logger.LogInformation(errorString);
                    return this.Unauthorized(new {status=errorString});
                }
                Card card = _dbContext.Cards.Find(cardId);
                _dbContext.Cards.Remove(card);
                _dbContext.SaveChangesForUser(user);
                _signalRHub.Clients.Group(boardId).SendAsync("ServerMessage","BoardUpdated");
                string status = $"BoardDataController.DeleteCard(cardId={cardId})";
                _logger.LogInformation(status);
                return new OkObjectResult(new {status});
            }
            catch (Exception ex)
            {
                string exceptionString = $"BoardDataController.DeleteCard(cardId={cardId}) exception occurred: {ex.ToString()}";
                _logger.LogInformation(exceptionString);
                return BadRequest(new {status=exceptionString});
            }
        }
        [HttpGet("Users")]
        public IEnumerable<dynamic> GetUsers()
        {
            return _dbContext.Users
                .Where(user => user.LastRequestTimeUTC > DateTime.UtcNow.AddMinutes(-5))
                .Select(user => user.GetServerResponsePayload()).ToList();
        }
        [HttpPost("Boards/{boardId}/BoardUsers")]
        public IActionResult AddUserToBoard(string boardId, ClientRequestPayload payload)
        {
            string userId = payload.Param1;
            try
            {
                ApplicationUser user = this.GetApplicationUser();
                if (GetUserPermissionLevelForBoard(boardId, user) != Board.PermissionLevels.Owner)
                {
                    string errorString = $"BoardDataController.AddUserToBoard(boardId:{boardId}) by user {user.UserName} access denied";
                     _logger.LogInformation(errorString);
                    return this.Unauthorized(new {status=errorString});
                }
                if (_dbContext.BoardUsers.Where(x => x.BoardId == boardId && x.ApplicationUserId == userId).ToList().Count > 0)
                {
                    string error = $"BoardDataController.AddUserToBoard BoardId={boardId}, userId={userId} already exists";
                    _logger.LogInformation(error);
                    return BadRequest(new {error});
                }
                BoardUser boardUser = new BoardUser() { BoardId=boardId, ApplicationUserId=userId };
                _dbContext.BoardUsers.Add(boardUser);
                _dbContext.SaveChangesForUser(user);
                _signalRHub.Clients.All.SendAsync("ServerMessage","BoardsUpdated");
                _signalRHub.Clients.Group(boardId).SendAsync("ServerMessage","BoardUpdated");
                string status = $"BoardDataController.AddUserToBoard BoardId={boardId}, userId={userId}";
                _logger.LogInformation(status);
                return new OkObjectResult(new {status});
            }
            catch (Exception ex)
            {
                string exceptionString = $"BoardDataController.AddUserToBoard BoardId={boardId}, userId={userId} exception occurred: {ex.ToString()}";
                _logger.LogInformation(exceptionString);
                return BadRequest(new {status=exceptionString});
            }            
        }
        [HttpPost("Chat/{chatId}")]
        public async Task<IActionResult> AddChatMessage(string chatId, ClientRequestPayload payload)
        {
            string chatMessageText = payload.Param1;
            try
            {
                ApplicationUser user = this.GetApplicationUser();
                string status = $"BoardDataController.AddChatMessage chatId={chatId}, chatMessage={chatMessageText}";
                _logger.LogInformation(status);
                ChatMessage chatMessage = new ChatMessage();
                chatMessage.ChatId = chatId;
                chatMessage.ApplicationUserId = user.Id;
                chatMessage.Message = chatMessageText;
                _dbContext.ChatMessages.Add(chatMessage);
                _dbContext.SaveChangesForUser(user);
                await _signalRHub.Clients.Group(chatId).SendAsync("ServerMessage","NewChatMessages");
                return new OkObjectResult(new {status});
            }
            catch (Exception ex)
            {
                string exceptionString = $"BoardDataController.AddChatMessage chatId={chatId}, exception occurred: {ex.ToString()}";
                _logger.LogInformation(exceptionString);
                return BadRequest(new {status=exceptionString});
            }            
        }
        [HttpGet("Chat/{chatId}")]
        public IEnumerable<Object> GetChatMessages(string chatId)
        {
            ApplicationUser user = this.GetApplicationUser();
            List<ChatMessage> chatMessages = _dbContext.ChatMessages
                .Include(msg => msg.ApplicationUser)
                .Where(msg => msg.ChatId == chatId)
                .OrderByDescending(msg => msg.CreatedDateUTC)
                .Take(30)  // Use a hard limit for now, to put a cap on payload returned
                .OrderBy(msg => msg.CreatedDateUTC)
                .ToList();

            return chatMessages.Select(msg => msg.GetServerResponsePayload(user)).ToList();
        }
    }
}
