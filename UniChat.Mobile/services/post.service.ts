import { API_BASE_URL } from "@/config/api";
import { Post } from "@/types";

export const fetchPosts = async (accessToken: string, page: number = 1, pageSize: number = 10): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/posts?page=${page}&pageSize=${pageSize}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const result = await response.json();
  return result;
};