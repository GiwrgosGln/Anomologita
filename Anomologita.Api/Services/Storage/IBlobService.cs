using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Anomologita.Api.Services;

public interface IBlobService
{
    Task<string?> UploadImageAsync(IFormFile file, string containerName);
    Task<bool> DeleteImageAsync(string blobUrl, string containerName);
}