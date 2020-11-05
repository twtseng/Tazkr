using System;
using System.Linq;
using System.Dynamic;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
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
    // [Authorize]
    [ApiController]
    [Route("[controller]")]    
    public class BoardDataController : ControllerBase
    {
        private readonly ILogger<BoardDataController> _logger;
        private readonly ApplicationDbContext _dbContext;
        public ApplicationUser GetApplicationUser()
        {
            string userId = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            ApplicationUser appUser = _dbContext.Users.Find(userId); 
            return appUser;       
        }
        public BoardDataController(ILogger<BoardDataController> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        [HttpGet("GetBoards")]
        public IEnumerable<Object> GetBoards()
        {
            return _dbContext.Boards
            .Include(board => board.CreatedBy)
            .Include(board => board.Columns)
            .ThenInclude(col => col.Cards)
            .Select(board => board.GetServerResponsePayload()).ToList();
        }
        [HttpGet("GetBoard/{boardId}")]
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

            dynamic boardPayload = board.GetServerResponsePayload();

            //Set permission level for this user
            if (board.CreatedBy.Id == user.Id)
            {
                boardPayload.PermissionLevel = Board.PermissionLevels.Owner.ToString();
            }
            else if (board.BoardUsers.Exists(x => x.ApplicationUserId == user.Id)) 
            {
                boardPayload.PermissionLevel = Board.PermissionLevels.User.ToString();
            }
            else
            {
                boardPayload.PermissionLevel = Board.PermissionLevels.Viewer.ToString();
            }

            return board.GetServerResponsePayload();
        }

        [HttpPut("CreateBoard")]
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
                _dbContext.SaveChanges();
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
        [HttpDelete("DeleteBoard")]
        public IActionResult DeleteBoard(ClientRequestPayload payload)
        {
            string boardId = payload.Param1;
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
                return BadRequest(new {status=errorString});                
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
                    _dbContext.SaveChanges();
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
        [HttpPatch("RenameBoard")]
        public IActionResult RenameBoard(ClientRequestPayload payload)        
        {
            string boardId = payload.Param1;
            string newName = payload.Param2;
            try
            {
                Board board = _dbContext.Boards.Find(boardId);
                board.Title = newName;
                _dbContext.Boards.Update(board);
                _dbContext.SaveChanges();
                string status = $"BoardDataController.RenameBoard(boardId:{boardId}), newName={newName}";
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
        [HttpPatch("AddColumnToBoard")]
        public IActionResult AddColumnToBoard(ClientRequestPayload payload)
        {
            string boardId = payload.Param1;
            string columnTitle = payload.Param2;
            try
            {
                Column column = new Column();
                column.BoardId = boardId;
                column.Title = columnTitle;

                // Set index to the next highest index for this Board, or 0 if this is the first column
                List<Column> columns = _dbContext.Boards.Include(x => x.Columns).FirstOrDefault(x => x.Id == column.BoardId).Columns.ToList();
                column.Index = columns.Count > 0 ? columns.Max(col => col.Index) + 1 : 0;

                _dbContext.Columns.Add(column);
                _dbContext.SaveChanges();
                string status = $"BoardDataController.AddColumnToBoard BoardId={boardId}, Title={columnTitle}";
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
        [HttpDelete("DeleteColumn")]
        public IActionResult DeleteColumn(ClientRequestPayload payload)
        {
            string columnId = payload.Param1;
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
                    foreach(Card card in column.Cards)
                    {
                        _dbContext.Cards.Remove(card);
                    }
                    _dbContext.Columns.Remove(column);
                    _dbContext.SaveChanges();
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
        [HttpPatch("RenameColumn")]
        public IActionResult RenameColumn(ClientRequestPayload payload)
        {
            string columnId = payload.Param1;
            string newName = payload.Param2;
            try
            {
                Column column = _dbContext.Columns.Find(columnId);
                column.Title = payload.Param2;
                _dbContext.Columns.Update(column);
                _dbContext.SaveChanges();
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
        [HttpPut("AddCardToColumn")]
        public IActionResult AddCardToColumn(ClientRequestPayload payload)
        {
            string columnId = payload.Param1;
            string cardTitle = payload.Param2;
            try
            {
                List<Card> cards = _dbContext.Columns.Include(x => x.Cards).FirstOrDefault(x => x.Id == columnId).Cards.ToList();
                Card card = new Card();
                card.Title = cardTitle;
                card.Index = cards.Count > 0 ? cards.Max(col => col.Index) + 1 : 0;
                card.ColumnId = columnId;
                _dbContext.Cards.Add(card);
                _dbContext.SaveChanges();
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
        [HttpPatch("MoveCardToColumnAtIndex")]
        public IActionResult MoveCardToColumnAtIndex(ClientRequestPayload payload)
        {
            string cardId = payload.Param1;
            string columnId = payload.Param2;
            int index = int.Parse(payload.Param3);
            try
            {
                Column column = _dbContext.Columns.Include(x => x.Cards).FirstOrDefault(x => x.Id == columnId);
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
                _dbContext.SaveChanges();
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
        [HttpPatch("UpdateCard")]
        public IActionResult UpdateCard(ClientRequestPayload payload)
        {
            string cardId = payload.Param1;
            string newName = payload.Param2;
            string newDescription = payload.Param3;
            try
            {
                Card card = _dbContext.Cards.Find(cardId);
                if (!string.IsNullOrWhiteSpace(newName))
                {
                    card.Title = newName;
                }
                if (!string.IsNullOrWhiteSpace(newDescription))
                {
                    card.Description = newDescription;
                }                
                _dbContext.Cards.Update(card);
                _dbContext.SaveChanges();
                string status = $"BoardDataController.UpdateCard cardId={cardId}, newName={newName}";
                _logger.LogInformation(status);
                return new OkObjectResult(new {status});
            }
            catch (Exception ex)
            {
                string exceptionString = $"BoardDataController.UpdateCard cardId={cardId}, newName={newName} exception occurred: {ex.ToString()}";
                _logger.LogInformation(exceptionString);
                return BadRequest(new {status=exceptionString});                
            }
        }
        [HttpDelete("DeleteCard")]
        public IActionResult DeleteCard(ClientRequestPayload payload)
        {
            string cardId = payload.Param1;
            try
            {
                Card card = _dbContext.Cards.Find(cardId);
                _dbContext.Cards.Remove(card);
                _dbContext.SaveChanges();
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
        [HttpGet("GetUsers")]
        public IEnumerable<ApplicationUserPayload> GetUsers()
        {
            return _dbContext.Users.Select(user => new ApplicationUserPayload(user)).ToList();
        }
        [HttpPatch("AddUserToBoard")]
        public IActionResult AddUserToBoard(ClientRequestPayload payload)
        {
            string boardId = payload.Param1;
            string userId = payload.Param2;
            try
            {
                if (_dbContext.BoardUsers.Where(x => x.BoardId == boardId && x.ApplicationUserId == userId).ToList().Count > 0)
                {
                    string error = $"BoardDataController.AddUserToBoard BoardId={boardId}, userId={userId} already exists";
                    _logger.LogInformation(error);
                    return BadRequest(new {error});
                }
                BoardUser boardUser = new BoardUser() { BoardId=boardId, ApplicationUserId=userId };
                _dbContext.BoardUsers.Add(boardUser);
                _dbContext.SaveChanges();
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
        [HttpGet("test")]
        public IEnumerable<dynamic> Test()
        {
            List<dynamic> results = new List<dynamic>();
            for(int i=0; i<10; ++i)
            {
                dynamic newObj = new ExpandoObject();
                newObj.Field1 = $"Field1Value {i}";
                newObj.Field2 = $"Field2Value {i}";
                results.Add(newObj);
            }
            return results;
        }
    }
}
