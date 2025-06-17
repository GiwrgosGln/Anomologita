export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    username: string;
    postId: string;
    imageUrl: string;
}

export interface CreateCommentRequest {
    content: string;
    postId: string;
}

export interface CreateCommentResponse {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    username: string;
    postId: string;
    imageUrl: string;
}