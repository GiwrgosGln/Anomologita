using System.ComponentModel.DataAnnotations;

namespace UniChat.Api.Data.Entities;

public class Post
{
    public Guid Id { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;
    public string Username { get; set; } = string.Empty;
    public Guid UniversityId { get; set; } = Guid.Empty;
}