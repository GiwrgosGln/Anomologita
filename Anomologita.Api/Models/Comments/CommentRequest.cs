using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Anomologita.Api.Models.Comments;

public class CommentRequest
{
    [Required]
    [MaxLength(500)]
    public string Content { get; set; } = string.Empty;

    [Required]
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }

}