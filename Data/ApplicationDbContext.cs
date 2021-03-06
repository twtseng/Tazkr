﻿using Tazkr.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Tazkr.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public DbSet<Board> Boards { get; set; }
        public DbSet<BoardUser> BoardUsers { get; set; }
        public DbSet<Column> Columns { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }

        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ApplicationUser>()
                .HasMany(user => user.BoardsCreated)
                .WithOne(board => board.CreatedBy);
                
            modelBuilder.Entity<BoardUser>()
                .HasKey(boardUser => new { boardUser.ApplicationUserId, boardUser.BoardId });

            modelBuilder.Entity<ChatMessage>()
                .HasKey(chat => new { chat.ChatId, chat.ApplicationUserId, chat.CreatedDateUTC });    
        }
        public override int SaveChanges()
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                BaseEntity entity = (BaseEntity) entityEntry.Entity;
                entity.UpdatedDateUTC = DateTime.UtcNow;

                if (entityEntry.State == EntityState.Added)
                {
                    entity.CreatedDateUTC = DateTime.UtcNow;
                }

                entity.UpdateHashCode = ((BaseEntity)entityEntry.Entity).GetHashCode();
            }

            return base.SaveChanges();
        }
        /// <summary>
        /// Record the user that modified the data
        /// </summary>
        public int SaveChangesForUser(ApplicationUser user)
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                BaseEntity entity = (BaseEntity) entityEntry.Entity;
                entity.UpdatedByUserId = user.Id;
            }

            return this.SaveChanges();
        }
    }
}
