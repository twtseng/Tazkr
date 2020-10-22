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
            this.BoardId = this.HubGroupId;
        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string BoardId { get; set; }
        public string Title { get; set; }

        public string CreatedById { get; set; }
        [InverseProperty("BoardsCreated")]
        public ApplicationUser CreatedBy { get; set; }
        public List<BoardUser> BoardUsers { get; set; }
        public List<Column> Columns { get; set; }
        public async Task<string> GetBoardJson(SignalRHub signalRHub)
        {
            Board board = await signalRHub.DbContext.Boards
            .Include(x => x.BoardUsers)
            .Include(x => x.Columns)
            .ThenInclude(x => x.Cards).FirstOrDefaultAsync(x => x.BoardId == this.BoardId);
            return JsonConvert.SerializeObject(board, Formatting.None,new JsonSerializerSettings(){ReferenceLoopHandling = ReferenceLoopHandling.Ignore});
        }
        public async Task AddColumn(SignalRHub signalRHub, string columnTitle)
        {
            signalRHub.Logger.LogInformation($"Board.AddColumn columnTitle={columnTitle}");
            Column column = new Column();
            column.BoardId = this.BoardId;
            column.Title = columnTitle;

            // Set index to the next highest index for this Board, or 0 if this is the first column
            List<Column> columns = signalRHub.DbContext.Boards.Include(x => x.Columns).FirstOrDefault(x => x.BoardId == this.BoardId).Columns.ToList();
            column.Index = columns.Count > 0 ? columns.Max(col => col.Index) + 1 : 0;

            signalRHub.DbContext.Columns.Add(column);
            await signalRHub.DbContext.SaveChangesAsync();
        }
        public async Task AddCardToColumn(SignalRHub signalRHub, string columnId)
        {
            signalRHub.Logger.LogInformation($"Board.AddCardToColumn columnId={columnId}");
            Card card = new Card();
            card.ColumnId = columnId;
            card.Title = "New Task";

            // Set index to the next highest index for this Column, or 0 if this is the first card
            List<Card> cards = signalRHub.DbContext.Columns.Include(x => x.Cards).FirstOrDefault(x => x.ColumnId == columnId).Cards.ToList();
            card.Index = cards.Count > 0 ? cards.Max(col => col.Index) + 1 : 0;

            signalRHub.DbContext.Cards.Add(card);
            await signalRHub.DbContext.SaveChangesAsync();
        }
        public async Task RenameCard(SignalRHub signalRHub, string cardId, string newName)
        {
            signalRHub.Logger.LogInformation($"Board.RenameCard cardId={cardId}, newName={newName}");
            Card card = signalRHub.DbContext.Cards.Find(cardId);
            card.Title = newName;
            signalRHub.DbContext.Cards.Update(card);
            await signalRHub.DbContext.SaveChangesAsync();
        }
        public async Task RenameColumn(SignalRHub signalRHub, string columnId, string newName)
        {
            signalRHub.Logger.LogInformation($"Board.RenameColumn columnId={columnId}, newName={newName}");
            Column column = signalRHub.DbContext.Columns.Find(columnId);
            column.Title = newName;
            signalRHub.DbContext.Columns.Update(column);
            await signalRHub.DbContext.SaveChangesAsync();
        }
        public async Task MoveCardToColumnAtIndex(SignalRHub signalRHub, string cardId, string columnId, int index)
        {
            signalRHub.Logger.LogInformation($"Board.MoveCardToColumnAtIndex cardId={cardId}, columnId={columnId}, index={index}");
            Column column = signalRHub.DbContext.Columns.Include(x => x.Cards).FirstOrDefault(x => x.ColumnId == columnId);
            List<Card> cards = column.Cards.OrderBy(x => x.Index).ToList();
            // First remove the target card from list (if it exists)
            int existingIndex = -1;
            for(int i=0; i < cards.Count; ++i)
            {
                if (cards[i].CardId == cardId)
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
                signalRHub.DbContext.Cards.Update(cards[i]);
            }
            Card cardToMove = signalRHub.DbContext.Cards.Find(cardId);
            cardToMove.ColumnId = columnId;
            cardToMove.Index = index;
            signalRHub.DbContext.Cards.Update(cardToMove);
            await signalRHub.DbContext.SaveChangesAsync();
        }
        public override async Task CallAction(SignalRHub signalRHub, ApplicationUser appUser, string hubGroupId, HubPayload hubPayload)
        {
            switch (hubPayload.Method)
            {
                case "JoinBoard":
                    signalRHub.Logger.LogInformation($"Board.JoinBoard({appUser.Email})");
                    await base.JoinGroup(signalRHub, appUser);
                    // TODO: Add this user to BoardUsers?
                    break; 
                case "RefreshBoard":
                    signalRHub.Logger.LogInformation($"Board.RefreshBoard");
                    await signalRHub.Clients.Group(this.HubGroupId).SendAsync("BoardJson", await this.GetBoardJson(signalRHub));
                    break;
                case "GetBoard":
                    signalRHub.Logger.LogInformation($"Board.GetBoard");
                    await signalRHub.Clients.Caller.SendAsync("BoardJson", await this.GetBoardJson(signalRHub));
                    break;
                case "AddColumn":
                    await this.AddColumn(signalRHub, hubPayload.Param1);
                    await signalRHub.Clients.Group(this.HubGroupId).SendAsync("BoardJson", await this.GetBoardJson(signalRHub));
                    break;
                case "AddCardToColumn":
                    await this.AddCardToColumn(signalRHub, hubPayload.Param1);
                    await signalRHub.Clients.Group(this.HubGroupId).SendAsync("BoardJson", await this.GetBoardJson(signalRHub));
                    break;
                case "RenameCard":
                    await this.RenameCard(signalRHub, hubPayload.Param1, hubPayload.Param2);
                    await signalRHub.Clients.Group(this.HubGroupId).SendAsync("BoardJson", await this.GetBoardJson(signalRHub));
                    break;      
                case "RenameColumn":
                    await this.RenameColumn(signalRHub, hubPayload.Param1, hubPayload.Param2);
                    await signalRHub.Clients.Group(this.HubGroupId).SendAsync("BoardJson", await this.GetBoardJson(signalRHub));
                    break;
                case "MoveCardToColumnAtIndex":
                    await this.MoveCardToColumnAtIndex(signalRHub, hubPayload.Param1, hubPayload.Param2, int.Parse(hubPayload.Param3));
                    await signalRHub.Clients.Group(this.HubGroupId).SendAsync("BoardJson", await this.GetBoardJson(signalRHub));
                    break;         
                default:
                    signalRHub.Logger.LogInformation($"Board UNKNOWN METHOD({hubPayload.Method})");
                    break;
            }
        }    

    }
}
