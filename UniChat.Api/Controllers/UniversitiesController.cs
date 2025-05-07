using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniChat.Api.Data.Entities;
using UniChat.Api.Models.Universities;
using UniChat.Api.Services;

namespace UniChat.Api.Controllers;

[ApiController]
public class UniversitiesController : ControllerBase
{
    private readonly IUniversityService _universityService;

    public UniversitiesController(IUniversityService universityService)
    {
        _universityService = universityService;
    }

    [HttpGet(ApiEndpoints.Universities.GetAll)]
    [ProducesResponseType(typeof(List<UniversityResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllUniversities([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var universities = await _universityService.GetAllUniversitiesAsync(pageNumber, pageSize);
        return Ok(universities);
    }
}