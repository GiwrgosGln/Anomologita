using Microsoft.EntityFrameworkCore;
using Anomologita.Api.Data;
using Anomologita.Api.Data.Entities;
using Anomologita.Api.Models.Auth;
using Anomologita.Api.Models.Posts;

namespace Anomologita.Api.Services;

public class AuthService : IAuthService
{
    private readonly AnomologitaDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;

    public AuthService(
        AnomologitaDbContext context,
        IPasswordService passwordService,
        ITokenService tokenService)
    {
        _context = context;
        _passwordService = passwordService;
        _tokenService = tokenService;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u =>
            u.Username.ToLower() == request.Username.ToLower());

        if (user == null)
        {
            return null;
        }

        if (!_passwordService.VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
        {
            return null;
        }

        user.LastLogin = DateTime.UtcNow;

        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = _tokenService.GetRefreshTokenExpiry();

        await _context.SaveChangesAsync();

        return new LoginResponse
        {
            AccessToken = _tokenService.GenerateAccessToken(user),
            AccessTokenExpiry = _tokenService.GetAccessTokenExpiry(),
            RefreshToken = refreshToken,
            RefreshTokenExpiry = user.RefreshTokenExpiry,
            UserId = user.Id,
            Username = user.Username,
            IsAdmin = user.IsAdmin,
            IsStudent = user.IsStudent,
            UniversityId = user.UniversityId ?? Guid.Empty
        };
    }

    public async Task<RegisterResponse?> RegisterAsync(RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || request.Username.Length < 6)
        {
            return new RegisterResponse { Success = false, Message = "Username too short." };
        }

        if (await _context.Users.AnyAsync(u => u.Username.ToLower() == request.Username.ToLower()))
        {
            return new RegisterResponse { Success = false, Message = "Username already taken." };
        }

        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
        {
            return new RegisterResponse { Success = false, Message = "Email already taken." };
        }

        _passwordService.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            IsStudent = true,
            IsAdmin = false,
            CreatedAt = DateTime.UtcNow
        };

        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = _tokenService.GetRefreshTokenExpiry();

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return new RegisterResponse
        {
            Success = true,
            Message = "Registration successful.",
            UserId = user.Id,
            Username = user.Username,
            IsAdmin = user.IsAdmin,
            IsStudent = user.IsStudent,
            UniversityId = user.UniversityId ?? Guid.Empty,
            AccessToken = _tokenService.GenerateAccessToken(user),
            AccessTokenExpiry = _tokenService.GetAccessTokenExpiry(),
            RefreshToken = refreshToken,
            RefreshTokenExpiry = user.RefreshTokenExpiry
        };
    }

    public async Task<RefreshTokenResponse?> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);

        if (user == null || user.RefreshTokenExpiry <= DateTime.UtcNow)
        {
            return null;
        }

        var newAccessToken = _tokenService.GenerateAccessToken(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = _tokenService.GetRefreshTokenExpiry();
        await _context.SaveChangesAsync();

        return new RefreshTokenResponse
        {
            AccessToken = newAccessToken,
            AccessTokenExpiry = _tokenService.GetAccessTokenExpiry(),
            RefreshToken = newRefreshToken,
            RefreshTokenExpiry = user.RefreshTokenExpiry
        };
    }

    public async Task<UserDetailsResponse?> GetUserDetailsAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.University)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return null;

        var posts = await _context.Posts
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var universityIds = posts.Select(p => p.UniversityId).Distinct().ToList();
        var universities = await _context.Universities
            .Where(u => universityIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u);

        var postResponses = posts.Select(post => new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UserId = post.UserId,
            Username = post.Username,
            ImageUrl = post.ImageUrl,
            UniversityId = post.UniversityId,
            UniversityShortName = universities.TryGetValue(post.UniversityId, out var university) ? university.ShortName : null
        }).ToList();

        return new UserDetailsResponse
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            UniversityId = user.UniversityId,
            UniversityName = user.University?.Name,
            UniversityShortName = user.University?.ShortName,
            CreatedAt = user.CreatedAt,
            Posts = postResponses
        };
    }

    public async Task<bool> UpdateUserUniversityAsync(Guid userId, Guid universityId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        var before = user.UniversityId;
        user.UniversityId = universityId;
        var result = await _context.SaveChangesAsync();

        Console.WriteLine($"User {userId}: UniversityId before={before}, after={user.UniversityId}, SaveChanges={result}");

        return result > 0;
    }
}