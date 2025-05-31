using Anomologita.Api.Models.Auth;

namespace Anomologita.Api.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<LoginResponse?> RegisterAsync(RegisterRequest request);
    Task<RefreshTokenResponse?> RefreshTokenAsync(RefreshTokenRequest request);
    Task<UserDetailsResponse?> GetUserDetailsAsync(Guid userId);
    Task<bool> UpdateUserUniversityAsync(Guid userId, Guid universityId);
}