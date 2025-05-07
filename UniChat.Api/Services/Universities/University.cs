using Microsoft.EntityFrameworkCore;
using UniChat.Api.Data;
using UniChat.Api.Data.Entities;
using UniChat.Api.Models.Universities;

namespace UniChat.Api.Services;

public class UniversityService : IUniversityService
{
    private readonly UniChatDbContext _dbContext;

    public UniversityService(UniChatDbContext dbContext)
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
