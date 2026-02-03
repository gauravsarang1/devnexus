export interface CreateCommentDTO {
  postId?: string;
  projectId?: string;
  parentCommentId?: string;
  content: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    uId: string;
    avatar: string | null;
  };
  createdAt: Date;
}
