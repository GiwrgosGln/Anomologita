using Microsoft.EntityFrameworkCore;
using UniChat.Api.Data;
using UniChat.Api.Data.Entities;
using UniChat.Api.Models.Auth;

namespace UniChat.Api.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<(bool Success, string Message, Guid? UserId)> RegisterAsync(RegisterRequest request);
}

public class AuthService : IAuthService
{
    private readonly UniChatDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;

    public AuthService(
        UniChatDbContext context,
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
            Token = _tokenService.GenerateAccessToken(user),
            RefreshToken = refreshToken,
            UserId = user.Id,
            Username = user.Username,
            IsAdmin = user.IsAdmin,
            IsStudent = user.IsStudent
        };
    }
    
    public async Task<(bool Success, string Message, Guid? UserId)> RegisterAsync(RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || request.Username.Length < 6)
        {
            return (false, "Username must be at least 6 characters long.", null);
        }
        
        if (await _context.Users.AnyAsync(u => u.Username.ToLower() == request.Username.ToLower()))
        {
            return (false, "Username is already taken.", null);
        }
        
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
        {
            return (false, "Email is already registered.", null);
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
        
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        
        return (true, "Registration successful.", user.Id);
    }
}