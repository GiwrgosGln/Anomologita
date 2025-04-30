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

    public async Task<Post> CreatePostAsync(PostRequest postRequest, Guid userId)
    {
        var post = new Post
        {
            Content = postRequest.Content,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
        };

        await _dbContext.Posts.AddAsync(post);
        await _dbContext.SaveChangesAsync();

        return post;
    }

    public Task<Post> GetPostByIdAsync(Guid postId)
    {
        var post = _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == postId);

        return post;
    }

    public Task<List<Post>> GetPostsByUserIdAsync(Guid userId, int pageNumber, int pageSize)
    {
        var posts = _dbContext.Posts
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return posts;
    }

    public Task<List<Post>> GetAllPostsAsync(int pageNumber, int pageSize)
    {
        var posts = _dbContext.Posts
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return posts;
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
