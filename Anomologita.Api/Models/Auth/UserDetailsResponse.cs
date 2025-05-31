using Anomologita.Api.Models.Posts;
namespace Anomologita.Api.Models.Auth;

public class UserDetailsResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid? UniversityId { get; set; }
    public string? UniversityName { get; set; }
    public string? UniversityShortName { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<PostResponse> Posts { get; set; } = new List<PostResponse>();
}