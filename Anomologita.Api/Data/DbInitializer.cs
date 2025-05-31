using Anomologita.Api.Data.Entities;
using Anomologita.Api.Services;

namespace Anomologita.Api.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        var context = serviceProvider.GetRequiredService<AnomologitaDbContext>();
        var passwordService = serviceProvider.GetRequiredService<IPasswordService>();

        // Create database if it doesn't exist
        await context.Database.EnsureCreatedAsync();

        // Check if we have any users
        if (!context.Users.Any())
        {
            await SeedUsersAsync(context, passwordService);
        }
    }

    private static async Task SeedUsersAsync(AnomologitaDbContext context, IPasswordService passwordService)
    {
        passwordService.CreatePasswordHash("Admin123!", out var adminHash, out var adminSalt);
        passwordService.CreatePasswordHash("Student123!", out var studentHash, out var studentSalt);

        var users = new List<User>
        {
            new()
            {
                Username = "admin",
                Email = "admin@anomologita.com",
                PasswordHash = adminHash,
                PasswordSalt = adminSalt,
                IsAdmin = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Username = "student",
                Email = "student@anomologita.com",
                PasswordHash = studentHash,
                PasswordSalt = studentSalt,
                IsStudent = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();
    }
}