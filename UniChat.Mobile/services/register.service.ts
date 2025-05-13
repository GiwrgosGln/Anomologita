import { API_BASE_URL } from "@/config/api";
import { RegisterRequest, RegisterResponse } from "@/types";

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