using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Anomologita.Api.Data.Entities;
using Anomologita.Api.Models.Universities;
using Anomologita.Api.Services;

namespace Anomologita.Api.Controllers;

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