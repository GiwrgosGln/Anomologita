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

export const fetchPostsByUniversity = async (universityId: string, accessToken: string, page: number = 1, pageSize: number = 10): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/posts/university/${universityId}?page=${page}&pageSize=${pageSize}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts for university");
  }

  const result = await response.json();
  return result;
}

export const createPost = async (
  accessToken: string,
  content: string,
  imageFile?: {
    uri: string;
    name: string;
    type: string;
  }
): Promise<Post> => {
  const formData = new FormData();
  
  formData.append("Content", content);
  
  if (imageFile) {
    formData.append("ImageFile", imageFile as any);
  }
  
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to create post: ${errorMessage}`);
  }

  const result = await response.json();
  return result;
};