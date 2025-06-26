using Anomologita.Api.Data.Entities;
using Anomologita.Api.Models.Posts;

namespace Anomologita.Api.Services;

public interface IPostService
{
    Task<PostResponse> CreatePostAsync(PostRequest postRequest, Guid userId);
    Task<PostResponse?> GetPostByIdAsync(Guid postId);
    Task<List<PostResponse>> GetPostsByUserIdAsync(Guid userId, int pageNumber, int pageSize);
    Task<List<PostResponse>> GetPostsByUniversityIdAsync(Guid universityId, int pageNumber, int pageSize);
    Task<List<PostResponse>> GetAllPostsAsync(int pageNumber, int pageSize);
    Task DeletePostAsync(Guid postId);
}