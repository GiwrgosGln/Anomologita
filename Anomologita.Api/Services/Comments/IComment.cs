using Anomologita.Api.Data.Entities;
using Anomologita.Api.Models.Comments;

namespace Anomologita.Api.Services;

public interface ICommentService
{
    Task<List<CommentResponse>> GetCommentsByPostIdAsync(Guid postId, int pageNumber, int pageSize);
    Task<CommentResponse> CreateCommentAsync(CommentRequest commentRequest);
    Task<Comment?> GetCommentByIdAsync(Guid commentId);
    Task DeleteCommentAsync(Guid commentId);
}