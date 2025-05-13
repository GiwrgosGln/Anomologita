namespace UniChat.Api.Models.Auth;

public class LoginResponse
{
    public string AccessToken { get; set; } = string.Empty;

    public string RefreshToken { get; set; } = string.Empty;
    public DateTime? RefreshTokenExpiry { get; set; }

    public Guid UserId { get; set; }

    public string Username { get; set; } = string.Empty;

    public bool IsAdmin { get; set; }

    public bool IsStudent { get; set; }
    public Guid UniversityId { get; set; } = Guid.Empty;
}