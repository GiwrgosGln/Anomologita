using Microsoft.AspNetCore.Mvc;
using Anomologita.Api.Models.Auth;
using Anomologita.Api.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Anomologita.Api.Auth;


namespace Anomologita.Api.Controllers;

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

        var response = await _authService.RegisterAsync(request);

        if (response == null)
        {
            return BadRequest(new { message = "Registration failed. Username or email may already be taken, or password/username is invalid." });
        }

        return Created(string.Empty, response);
    }

    [HttpPost(ApiEndpoints.Users.RefreshToken)]
    [ProducesResponseType(typeof(RefreshTokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var response = await _authService.RefreshTokenAsync(request);

        if (response == null)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token." });
        }

        return Ok(response);
    }

    [Authorize(AuthConstants.StudentUserPolicyName)]
    [HttpGet(ApiEndpoints.Users.Me)]
    [ProducesResponseType(typeof(UserDetailsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<UserDetailsResponse>> GetMe()
    {
        var userId = User.FindFirst("userid")?.Value;
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
        {
            return Unauthorized();
        }

        var userDetails = await _authService.GetUserDetailsAsync(userGuid);
        if (userDetails == null)
        {
            return NotFound("User not found");
        }

        return Ok(userDetails);
    }

    [Authorize(AuthConstants.StudentUserPolicyName)]
    [HttpPut(ApiEndpoints.Users.UpdateUniversity)]
    public async Task<IActionResult> UpdateUniversity([FromBody] UpdateUniversityRequest request)
    {
        var userId = User.FindFirst("userid")?.Value;
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
        {
            return Unauthorized();
        }

        var success = await _authService.UpdateUserUniversityAsync(userGuid, request.UniversityId);
        if (!success)
        {
            return NotFound("User not found");
        }

        return NoContent();
    }
}