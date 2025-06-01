namespace Anomologita.Api;

public static class ApiEndpoints
{
    private const string ApiBase = "api";

    public static class Users
    {
        private const string Base = $"{ApiBase}/auth";

        public const string Login = $"{Base}/login";
        public const string Register = $"{Base}/register";
        public const string RefreshToken = $"{Base}/refresh";
        public const string Me = $"{Base}/me";
        public const string UpdateUniversity = $"{Base}/update-university";
    }

    public static class Posts
    {
        private const string Base = $"{ApiBase}/posts";

        public const string Create = $"{Base}";
        public const string GetById = $"{Base}/{{id}}";
        public const string GetByUserId = $"{Base}/user/{{userId}}";
        public const string GetByUniversityId = $"{Base}/university/{{universityId}}";
        public const string GetAll = $"{Base}";
        public const string Delete = $"{Base}/{{id}}";
    }

    public static class Universities
    {
        private const string Base = $"{ApiBase}/universities";

        public const string GetAll = $"{Base}";
    }

    public static class Comments
    {
        private const string Base = $"{ApiBase}/comments";

        public const string Create = $"{Base}";
        public const string GetByPostId = $"{Base}/post/{{postId}}";
        public const string GetById = $"{Base}/{{commentId}}";
        public const string Delete = $"{Base}/{{commentId}}";
    }
}