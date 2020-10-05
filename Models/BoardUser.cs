using System;

namespace Tazkr.Models
{
    public class BoardUser
    {
        // NOTE: Composite key ApplicationUserId, BoardId defined in ApplicationDbContext.OnModelCreating
        public string ApplicationUserId { get; set; }
        public int BoardId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public Board Board { get; set; }
    }
}
