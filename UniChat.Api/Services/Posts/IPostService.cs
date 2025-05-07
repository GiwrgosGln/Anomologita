using UniChat.Api.Data.Entities;
using UniChat.Api.Models.Posts;

namespace UniChat.Api.Services;

public interface IPostService
{
    Task<PostResponse> CreatePostAsync(PostRequest postRequest, Guid userId);
    Task<PostResponse?> GetPostByIdAsync(Guid postId);
    Task<List<PostResponse>> GetPostsByUserIdAsync(Guid userId, int pageNumber, int pageSize);
    Task<List<PostResponse>> GetPostsByUniversityIdAsync(Guid universityId, int pageNumber, int pageSize);
    Task<List<PostResponse>> GetAllPostsAsync(int pageNumber, int pageSize);
    Task<bool> DeletePostAsync(Guid postId, Guid userId);
}