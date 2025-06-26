using Microsoft.EntityFrameworkCore;
using Anomologita.Api.Data;
using Anomologita.Api.Data.Entities;
using Anomologita.Api.Models.Comments;

namespace Anomologita.Api.Services;

public class CommentService : ICommentService
{
    private readonly AnomologitaDbContext _dbContext;

    public CommentService(AnomologitaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<CommentResponse>> GetCommentsByPostIdAsync(Guid postId, int pageNumber, int pageSize)
    {
        var comments = await _dbContext.Comments
            .Include(c => c.User)
            .Where(c => c.PostId == postId)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return comments.Select(c => new CommentResponse
        {
            Id = c.Id,
            Content = c.Content,
            PostId = c.PostId,
            UserId = c.UserId,
            Username = c.User?.Username ?? string.Empty,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        }).ToList();
    }

    public async Task<CommentResponse> CreateCommentAsync(CommentRequest commentRequest)
    {
        var user = await _dbContext.Users.FindAsync(commentRequest.UserId);

        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            Content = commentRequest.Content,
            PostId = commentRequest.PostId,
            UserId = commentRequest.UserId,
            Username = user?.Username ?? string.Empty,
            UniversityId = user?.UniversityId ?? Guid.Empty,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Comments.Add(comment);
        await _dbContext.SaveChangesAsync();

        return new CommentResponse
        {
            Id = comment.Id,
            Content = comment.Content,
            PostId = comment.PostId,
            UserId = comment.UserId,
            Username = comment.Username,
            UniversityId = comment.UniversityId,
            CreatedAt = comment.CreatedAt,
            UpdatedAt = comment.UpdatedAt
        };
    }

    public async Task<Comment?> GetCommentByIdAsync(Guid commentId)
    {
        return await _dbContext.Comments
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == commentId);
    }

    public async Task DeleteCommentAsync(Guid commentId)
    {
        var comment = await _dbContext.Comments.FindAsync(commentId);
        if (comment != null)
        {
            _dbContext.Comments.Remove(comment);
            await _dbContext.SaveChangesAsync();
        }
    }
}