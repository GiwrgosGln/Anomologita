namespace UniChat.Api.Services;

public static class ValidationService
{
    public static bool IsValidPassword(string password)
    {
        // Password must be at least 8 characters
        if (string.IsNullOrEmpty(password) || password.Length < 8)
            return false;
            
        // Must contain at least one uppercase letter
        if (!password.Any(char.IsUpper))
            return false;
            
        // Must contain at least one lowercase letter
        if (!password.Any(char.IsLower))
            return false;
            
        // Must contain at least one digit
        if (!password.Any(char.IsDigit))
            return false;
            
        // Must contain at least one special character
        if (!password.Any(c => !char.IsLetterOrDigit(c)))
            return false;
            
        return true;
    }
    
    public static bool IsValidUsername(string username)
    {
        // Username must be between 3 and 50 characters
        if (string.IsNullOrEmpty(username) || username.Length < 3 || username.Length > 50)
            return false;
            
        // Username should only contain letters, numbers, dots, underscores, or hyphens
        return username.All(c => char.IsLetterOrDigit(c) || c == '.' || c == '_' || c == '-');
    }
}