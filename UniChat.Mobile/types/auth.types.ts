export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiry: string;
  userId: string;
  username: string;
  isAdmin: boolean;
  isStudent: boolean;
  universityId: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
    message: string;
}

export interface RefreshRequest {
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiry: string;
}