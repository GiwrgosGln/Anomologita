using Microsoft.AspNetCore.Mvc;
using UniChat.Api.Models.Auth;
using UniChat.Api.Services;

namespace UniChat.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);
        
        if (response == null)
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }
        
        return Ok(response);
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var (success, message, userId) = await _authService.RegisterAsync(request);
        
        var response = new RegisterResponse
        {
            Success = success,
            Message = message,
            UserId = userId
        };
        
        if (!success)
        {
            return BadRequest(response);
        }
        
        return CreatedAtAction(nameof(Register), new { id = userId }, response);
    }
}