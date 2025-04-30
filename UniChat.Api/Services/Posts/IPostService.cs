using UniChat.Api.Data.Entities;
using UniChat.Api.Models.Posts;

namespace UniChat.Api.Services;

public interface IPostService
{
    Task<Post> CreatePostAsync(PostRequest postRequest, Guid userId);
    Task<Post> GetPostByIdAsync(Guid postId);
    Task<List<Post>> GetPostsByUserIdAsync(Guid userId, int pageNumber, int pageSize);
    Task<List<Post>> GetAllPostsAsync(int pageNumber, int pageSize);
    Task<bool> DeletePostAsync(Guid postId, Guid userId);
}