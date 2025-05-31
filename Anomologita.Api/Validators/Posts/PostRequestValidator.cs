using FluentValidation;
using Anomologita.Api.Models.Posts;

namespace Anomologita.Api.Validators.Posts
{
    public class PostRequestValidator : AbstractValidator<PostRequest>
    {
        public PostRequestValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage("Content is required.")
                .MinimumLength(20)
                .WithMessage("Content must be at least 20 characters long.")
                .MaximumLength(500)
                .WithMessage("Content must not exceed 500 characters.");
        }
    }
}