using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Anomologita.Api.Auth;
using Anomologita.Api.Data.Entities;
using Anomologita.Api.Models.Comments;
using Anomologita.Api.Services;

namespace Anomologita.Api.Controllers;

[ApiController]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [Authorize(AuthConstants.StudentUserPolicyName)]
    [HttpGet(ApiEndpoints.Comments.GetByPostId)]
    [ProducesResponseType(typeof(List<CommentResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCommentsByPostId([FromRoute] Guid postId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var comments = await _commentService.GetCommentsByPostIdAsync(postId, pageNumber, pageSize);
        return Ok(comments);
    }

    [Authorize(AuthConstants.StudentUserPolicyName)]
    [HttpPost(ApiEndpoints.Comments.Create)]
    [ProducesResponseType(typeof(CommentResponse), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateComment([FromBody] CommentRequest commentRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = Guid.Parse(User.FindFirst("userid")?.Value ?? string.Empty);
        commentRequest.UserId = userId;

        // TEMP: Log or check value
        if (commentRequest.UserId == Guid.Empty)
        {
            return BadRequest("UserId is empty after assignment!");
        }

        var comment = await _commentService.CreateCommentAsync(commentRequest);
        return CreatedAtAction(nameof(GetCommentsByPostId), new { postId = comment.PostId }, comment);
    }

    [Authorize(AuthConstants.StudentUserPolicyName)]
    [HttpGet(ApiEndpoints.Comments.GetById)]
    [ProducesResponseType(typeof(CommentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCommentById([FromRoute] Guid commentId)
    {
        var comment = await _commentService.GetCommentByIdAsync(commentId);
        if (comment == null)
        {
            return NotFound(new { message = "Comment not found" });
        }

        return Ok(comment);
    }

    [Authorize(AuthConstants.StudentUserPolicyName)]
    [HttpDelete(ApiEndpoints.Comments.Delete)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteComment([FromRoute] Guid commentId)
    {
        var comment = await _commentService.GetCommentByIdAsync(commentId);
        if (comment == null)
        {
            return NotFound(new { message = "Comment not found" });
        }

        var userId = Guid.Parse(User.FindFirst("userid")?.Value ?? string.Empty);
        if (comment.UserId != userId)
        {
            return Forbid();
        }

        await _commentService.DeleteCommentAsync(commentId);
        return NoContent();
    }
}