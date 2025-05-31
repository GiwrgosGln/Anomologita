using Anomologita.Api.Data.Entities;
using Anomologita.Api.Models.Universities;

namespace Anomologita.Api.Services;

public interface IUniversityService
{
    Task<List<UniversityResponse>> GetAllUniversitiesAsync(int pageNumber, int pageSize);
}