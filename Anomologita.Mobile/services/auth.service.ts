import { API_BASE_URL } from "@/config/api";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RefreshRequest, RefreshResponse } from "@/types";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  console.log("Login data:", data);
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

  console.log("Login response:", response);
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

  console.log("Register response:", response);
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

export const fetchUser = async (token: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const result = await response.json();
  return result;
}

export const updateUniversity = async (token: string, universityId: string): Promise<any> => {
  if (!universityId) throw new Error("No universityId provided");
  const response = await fetch(`${API_BASE_URL}/auth/update-university`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ universityId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to update university: ${response.status} ${text}`);
  }

  if (response.status === 204) {
    return;
  }

  const result = await response.json();
  return result;
};