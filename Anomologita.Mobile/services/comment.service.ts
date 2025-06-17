import { API_BASE_URL } from "@/config/api";
import { Comment, CreateCommentRequest, CreateCommentResponse } from "@/types";

export const fetchComments = async (accessToken: string, postId: string): Promise<Comment[]> => {
    const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`, {
    method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch comments");
    }

    const result = await response.json();
    return result;
}

export const createComment = async (accessToken: string, data: CreateCommentRequest): Promise<CreateCommentResponse> => {
      const response = await fetch(`${API_BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(data),
  });

  if(!response.ok){
    throw new Error("Failed to create comment")
  }

  const result = await response.json();
  return result;
}