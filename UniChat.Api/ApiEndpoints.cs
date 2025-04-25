namespace UniChat.Api;

public static class ApiEndpoints
{
    private const string ApiBase = "api";
    
    public static class Users
    {
        private const string Base = $"{ApiBase}/users";

        public const string Register = $"{Base}/register";
        public const string Login = $"{Base}/login";
        public const string Me = $"{Base}/me";
    }
}