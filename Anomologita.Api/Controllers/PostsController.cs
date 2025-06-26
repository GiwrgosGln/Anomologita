using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Anomologita.Api.Auth;
using Anomologita.Api.Data.Entities;
using Anomologita.Api.Models.Posts;
using Anomologita.Api.Services;

namespace Anomologita.Api.Controllers;

[ApiController]
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;

    public PostsController(IPostService postService)
    {
        _postService = postService;
    }

    [Authorize(AuthConstants.StudentUserPolicyName)]
    [HttpPost(ApiEndpoints.Posts.Create)]
    [ProducesResponseType(typeof(PostResponse), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreatePost([FromForm] PostRequest postRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = Guid.Parse(User.FindFirst("userid")?.Value ?? string.Empty);
        var post = await _postService.CreatePostAsync(postRequest, userId);

        return CreatedAtAction(nameof(GetPostById), new { id = post.Id }, post);
    }

    [Authorize(AuthConstants.StudentUserPolicyName)]
    [HttpGet(ApiEndpoints.Posts.GetById)]
    [ProducesResponseType(typeof(PostResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPostById([FromRoute] Guid id)
    {
        var post = await _postService.GetPostByIdAsync(id);

        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        return Ok(post);
    }

    [Authorize(AuthConstants.StudentUserPolicyName)]
    [HttpGet(ApiEndpoints.Posts.GetByUserId)]
    [ProducesResponseType(typeof(List<PostResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPostsByUserId([FromRoute] Guid userId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var posts = await _postService.GetPostsByUserIdAsync(userId, pageNumber, pageSize);
        return Ok(posts);
    }

    [Authorize(AuthConstants.StudentUserPolicyName)]
    [HttpGet(ApiEndpoints.Posts.GetByUniversityId)]
    [ProducesResponseType(typeof(List<PostResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPostsByUniversityId([FromRoute] Guid universityId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var posts = await _postService.GetPostsByUniversityIdAsync(universityId, pageNumber, pageSize);
        return Ok(posts);
    }

    [Authorize(AuthConstants.StudentUserPolicyName)]
    [HttpGet(ApiEndpoints.Posts.GetAll)]
    [ProducesResponseType(typeof(List<PostResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllPosts([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var posts = await _postService.GetAllPostsAsync(pageNumber, pageSize);
        return Ok(posts);
    }

    [Authorize(AuthConstants.StudentUserPolicyName)]
    [HttpDelete(ApiEndpoints.Posts.Delete)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletePost([FromRoute] Guid id)
    {
        var post = await _postService.GetPostByIdAsync(id);
        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        var userId = Guid.Parse(User.FindFirst("userid")?.Value ?? string.Empty);
        if (post.UserId != userId)
        {
            return Forbid();
        }

        await _postService.DeletePostAsync(id);
        return NoContent();
    }
}