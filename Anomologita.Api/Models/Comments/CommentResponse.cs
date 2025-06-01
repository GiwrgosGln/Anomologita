using System.ComponentModel.DataAnnotations;

namespace Anomologita.Api.Models.Comments;

public class CommentResponse
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(500)]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public Guid UserId { get; set; }

    public string Username { get; set; } = string.Empty;

    public Guid PostId { get; set; }

    public string? ImageUrl { get; set; }
}