using System.ComponentModel.DataAnnotations;

namespace UniChat.Api.Models.Posts;

public class PostRequest
{
    [Required]
    [MaxLength(500)]
    public string Content { get; set; } = string.Empty;
}