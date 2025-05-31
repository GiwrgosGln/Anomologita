using Microsoft.EntityFrameworkCore;
using Anomologita.Api.Data;
using Anomologita.Api.Data.Entities;
using Anomologita.Api.Models.Universities;

namespace Anomologita.Api.Services;

public class UniversityService : IUniversityService
{
    private readonly AnomologitaDbContext _dbContext;

    public UniversityService(AnomologitaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<UniversityResponse>> GetAllUniversitiesAsync(int pageNumber, int pageSize)
    {
        var universities = await _dbContext.Universities
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return universities.Select(u => new UniversityResponse
        {
            Id = u.Id,
            Name = u.Name,
            Location = u.Location,
            Website = u.Website,
            ShortName = u.ShortName,
        }).ToList();
    }
}
