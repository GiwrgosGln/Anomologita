using System.ComponentModel.DataAnnotations;

namespace Anomologita.Api.Data.Entities;

public class Comment
{
    public Guid Id { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public Guid UserId { get; set; }

    public virtual User User { get; set; } = null!;

    public Guid PostId { get; set; }

    public virtual Post Post { get; set; } = null!;

    public string Username { get; set; } = string.Empty;

    public Guid UniversityId { get; set; } = Guid.Empty;

}