using Microsoft.EntityFrameworkCore;
using UniChat.Api.Data;
using UniChat.Api.Data.Entities;
using UniChat.Api.Models.Posts;

namespace UniChat.Api.Services;

public class PostService : IPostService
{
    private readonly UniChatDbContext _dbContext;
    private readonly IAuthService _authService;
    private readonly ITokenService _tokenService;

    public PostService(
        UniChatDbContext dbContext,
        IAuthService authService,
        ITokenService tokenService)
    {
        _dbContext = dbContext;
        _authService = authService;
        _tokenService = tokenService;
    }

    public async Task<PostResponse> CreatePostAsync(PostRequest postRequest, Guid userId)
    {
        var user = await _dbContext.Users.FindAsync(userId);

        var post = new Post
        {
            Content = postRequest.Content,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            Username = user?.Username ?? string.Empty
        };

        await _dbContext.Posts.AddAsync(post);
        await _dbContext.SaveChangesAsync();

        return new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UserId = post.UserId,
            Username = post.Username
        };
    }

    public async Task<PostResponse?> GetPostByIdAsync(Guid postId)
    {
        var post = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == postId);

        if (post == null) return null;

        return new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UserId = post.UserId,
            Username = post.User?.Username ?? string.Empty
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

        return posts.Select(post => new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UserId = post.UserId,
            Username = post.User?.Username ?? string.Empty
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

        return posts.Select(post => new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UserId = post.UserId,
            Username = post.User?.Username ?? string.Empty
        }).ToList();
    }

    public async Task<bool> DeletePostAsync(Guid postId, Guid userId)
    {
        var post = await _dbContext.Posts.FindAsync(postId);
        if (post == null || post.UserId != userId)
        {
            return false;
        }

        _dbContext.Posts.Remove(post);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}
