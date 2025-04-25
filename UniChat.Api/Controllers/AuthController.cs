using Microsoft.AspNetCore.Mvc;
using UniChat.Api.Models.Auth;
using UniChat.Api.Services;


namespace UniChat.Api.Controllers;

[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost(ApiEndpoints.Users.Login)]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);

        if (response == null)
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        return Ok(response);
    }

    [HttpPost(ApiEndpoints.Users.Register)]
    [ProducesResponseType(typeof(RegisterResponse), StatusCodes.Status201Created)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var (success, message, userId) = await _authService.RegisterAsync(request);

        if (!success)
        {
            return BadRequest(new { message });
        }

        return CreatedAtAction(nameof(Register), new { id = userId }, new { message });
    }
}