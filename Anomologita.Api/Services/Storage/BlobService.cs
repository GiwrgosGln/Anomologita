using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Anomologita.Api.Services;

public class BlobService : IBlobService
{
    private readonly BlobServiceClient _blobServiceClient;

    public BlobService(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("AzureBlobStorage");
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Azure Blob Storage connection string not found.");
        }
        _blobServiceClient = new BlobServiceClient(connectionString);
    }

    public async Task<string?> UploadImageAsync(IFormFile file, string containerName)
    {
        if (file == null || file.Length == 0)
        {
            return null;
        }

        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.None);

        var blobName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var blobClient = containerClient.GetBlobClient(blobName);

        await using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
        }

        return blobClient.Uri.ToString();
    }

    public async Task<bool> DeleteImageAsync(string blobUrl, string containerName)
    {
        if (string.IsNullOrEmpty(blobUrl) || string.IsNullOrEmpty(containerName))
        {
            return false;
        }

        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);

        Uri uri = new Uri(blobUrl);
        string blobName = Path.GetFileName(uri.LocalPath);

        if (string.IsNullOrEmpty(blobName))
        {
            return false;
        }

        var blobClient = containerClient.GetBlobClient(blobName);

        try
        {
            var response = await blobClient.DeleteIfExistsAsync();
            return response.Value;
        }
        catch (Exception)
        {
            return false;
        }
    }
}