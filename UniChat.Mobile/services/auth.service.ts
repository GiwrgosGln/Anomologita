import { API_BASE_URL } from "@/config/api";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RefreshRequest, RefreshResponse } from "@/types";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const result = await response.json();
  return result;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  const result = await response.json();
  return result;
};

export const refresh = async (data: RefreshRequest): Promise<RefreshResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  const result = await response.json();
  return result;
};