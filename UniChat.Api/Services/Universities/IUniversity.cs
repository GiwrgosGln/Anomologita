using UniChat.Api.Data.Entities;
using UniChat.Api.Models.Universities;

namespace UniChat.Api.Services;

public interface IUniversityService
{
    Task<List<UniversityResponse>> GetAllUniversitiesAsync(int pageNumber, int pageSize);
}