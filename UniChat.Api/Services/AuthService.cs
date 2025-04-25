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
        
        // Update last login time
        user.LastLogin = DateTime.UtcNow;
        
        // Generate new refresh token
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
        // Validate username format
        if (!ValidationService.IsValidUsername(request.Username))
        {
            return (false, "Username must be between 3-50 characters and can only contain letters, numbers, dots, underscores or hyphens.", null);
        }
        
        // Check if username already exists
        if (await _context.Users.AnyAsync(u => u.Username.ToLower() == request.Username.ToLower()))
        {
            return (false, "Username is already taken.", null);
        }
        
        // Check if email already exists
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
        {
            return (false, "Email is already registered.", null);
        }
        
        // Validate password strength
        if (!ValidationService.IsValidPassword(request.Password))
        {
            return (false, "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.", null);
        }
        
        // Create password hash
        _passwordService.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
        
        // Create new user (always as a student, not admin)
        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            IsStudent = true,  // Set as student
            IsAdmin = false,   // Not an admin
            CreatedAt = DateTime.UtcNow
        };
        
        // Add user to database
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        
        return (true, "Registration successful.", user.Id);
    }
}