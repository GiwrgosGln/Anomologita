export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  username: string;
  isAdmin: boolean;
  isStudent: boolean;
  universityId: string;
}