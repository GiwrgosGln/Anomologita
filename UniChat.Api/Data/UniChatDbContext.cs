using Microsoft.EntityFrameworkCore;
using UniChat.Api.Data.Entities;

namespace UniChat.Api.Data;

public class UniChatDbContext : DbContext
{
    public UniChatDbContext(DbContextOptions<UniChatDbContext> options) : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}