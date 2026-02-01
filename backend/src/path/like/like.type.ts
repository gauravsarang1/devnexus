import { Like_Type } from "@prisma/client";

export interface LikeToggleInput {
    likeType: Like_Type;
    postId?: string;
    projectId?: string;
    reviewId?: string;
}

export interface LikeResponse {
    id: string;
    userId: string;
    likeType: Like_Type;
    postId?: string | null;
    projectId?: string | null;
    reviewId?: string | null;
    createdAt: Date;
}
