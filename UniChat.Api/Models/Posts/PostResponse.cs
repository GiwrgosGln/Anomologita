using System.ComponentModel.DataAnnotations;

namespace UniChat.Api.Models.Posts;

public class PostResponse
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(500)]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid UserId { get; set; }

    public string Username { get; set; } = string.Empty;
    public Guid UniversityId { get; set; } = Guid.Empty;
}