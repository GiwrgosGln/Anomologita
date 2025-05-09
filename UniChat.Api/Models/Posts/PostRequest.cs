using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace UniChat.Api.Models.Posts;

public class PostRequest
{
    [Required]
    [MaxLength(500)]
    public string Content { get; set; } = string.Empty;

    public IFormFile? ImageFile { get; set; }
}