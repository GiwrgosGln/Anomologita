using Microsoft.EntityFrameworkCore;
using Anomologita.Api.Data;
using Anomologita.Api.Data.Entities;
using Anomologita.Api.Models.Posts;

namespace Anomologita.Api.Services;

public class PostService : IPostService
{
    private readonly AnomologitaDbContext _dbContext;
    private readonly IAuthService _authService;
    private readonly ITokenService _tokenService;
    private readonly IBlobService _blobService;

    public PostService(
        AnomologitaDbContext dbContext,
        IAuthService authService,
        ITokenService tokenService,
        IBlobService blobService)
    {
        _dbContext = dbContext;
        _authService = authService;
        _tokenService = tokenService;
        _blobService = blobService;
    }

    public async Task<PostResponse> CreatePostAsync(PostRequest postRequest, Guid userId)
    {
        var user = await _dbContext.Users.FindAsync(userId);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        if (user.UniversityId == null)
        {
            throw new InvalidOperationException("User must be associated with a university to create a post.");
        }

        string? imageUrl = null;
        if (postRequest.ImageFile != null && postRequest.ImageFile.Length > 0)
        {
            imageUrl = await _blobService.UploadImageAsync(postRequest.ImageFile, "post-images");
        }

        var post = new Post
        {
            Content = postRequest.Content,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            Username = user.Username,
            ImageUrl = imageUrl,
            UniversityId = user.UniversityId.Value
        };

        await _dbContext.Posts.AddAsync(post);
        await _dbContext.SaveChangesAsync();

        var university = await _dbContext.Universities.FindAsync(user.UniversityId.Value);

        return new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UserId = post.UserId,
            Username = post.Username,
            ImageUrl = post.ImageUrl,
            UniversityId = post.UniversityId,
            UniversityShortName = university?.ShortName
        };
    }

    public async Task<PostResponse?> GetPostByIdAsync(Guid postId)
    {
        var post = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == postId);

        if (post == null) return null;

        var university = await _dbContext.Universities.FindAsync(post.UniversityId);

        return new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UserId = post.UserId,
            Username = post.User?.Username ?? string.Empty,
            ImageUrl = post.ImageUrl,
            UniversityId = post.UniversityId,
            UniversityShortName = university?.ShortName
        };
    }

    public async Task<List<PostResponse>> GetPostsByUserIdAsync(Guid userId, int pageNumber, int pageSize)
    {
        var posts = await _dbContext.Posts
            .Include(p => p.User)
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var universityIds = posts.Select(p => p.UniversityId).Distinct().ToList();
        var universities = await _dbContext.Universities
            .Where(u => universityIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.ShortName);

        return posts.Select(post => new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UserId = post.UserId,
            Username = post.User?.Username ?? string.Empty,
            ImageUrl = post.ImageUrl,
            UniversityId = post.UniversityId,
            UniversityShortName = universities.GetValueOrDefault(post.UniversityId)
        }).ToList();
    }

    public async Task<List<PostResponse>> GetPostsByUniversityIdAsync(Guid universityId, int pageNumber, int pageSize)
    {
        var university = await _dbContext.Universities.FindAsync(universityId);
        var universityShortName = university?.ShortName;

        var posts = await _dbContext.Posts
            .Include(p => p.User)
            .Where(p => p.UniversityId == universityId)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return posts.Select(post => new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UserId = post.UserId,
            Username = post.User?.Username ?? string.Empty,
            ImageUrl = post.ImageUrl,
            UniversityId = post.UniversityId,
            UniversityShortName = universityShortName
        }).ToList();
    }

    public async Task<List<PostResponse>> GetAllPostsAsync(int pageNumber, int pageSize)
    {
        var posts = await _dbContext.Posts
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var universityIds = posts.Select(p => p.UniversityId).Distinct().ToList();
        var universities = await _dbContext.Universities
            .Where(u => universityIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.ShortName);

        return posts.Select(post => new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UserId = post.UserId,
            Username = post.User?.Username ?? string.Empty,
            ImageUrl = post.ImageUrl,
            UniversityId = post.UniversityId,
            UniversityShortName = universities.GetValueOrDefault(post.UniversityId)
        }).ToList();
    }

    public async Task DeletePostAsync(Guid postId)
    {
        var post = await _dbContext.Posts.FindAsync(postId);
        if (post != null)
        {
            // TODO: Implement image deletion when deleting a post
            if (!string.IsNullOrEmpty(post.ImageUrl))
            {
                // Add image deletion logic here
            }

            _dbContext.Posts.Remove(post);
            await _dbContext.SaveChangesAsync();
        }
    }
}
