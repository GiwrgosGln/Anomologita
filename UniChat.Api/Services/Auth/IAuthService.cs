using UniChat.Api.Models.Auth;

namespace UniChat.Api.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<(bool Success, string Message, Guid? UserId)> RegisterAsync(RegisterRequest request);
    Task<RefreshTokenResponse?> RefreshTokenAsync(RefreshTokenRequest request);
    Task<UserDetailsResponse?> GetUserDetailsAsync(Guid userId);
}