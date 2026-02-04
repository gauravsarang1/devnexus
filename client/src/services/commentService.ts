import apiClient from "./apiClient";
import { unwrap } from "../utils/apiHelper";
import {
    BaseApiResponse,
    PaginatedResponse,
} from "../utils/apiResponse";
import { Comment } from "../types";

/* ---------------- Types ---------------- */

export type CommentPaginatedResponse =
    PaginatedResponse<Comment, "comments">;

export type CommentResponse = BaseApiResponse<Comment>;

export type CreateCommentInput = {
    content: string;
    postId?: string;
    projectId?: string;
    parentCommentId?: string;
};

export type CommentQueryParams = {
    page?: number;
    limit?: number;
};

/* ---------------- Service ---------------- */

export const commentService = {
    /* -------- Queries -------- */

    getPostComments: async (
        postId: string,
        params: CommentQueryParams = {}
    ): Promise<CommentPaginatedResponse["data"]> => {
        const res = await apiClient.get<CommentPaginatedResponse>(
            `/comments/post/${postId}`,
            { params }
        );

        return res.data.data;
    },

    getProjectComments: async (
        projectId: string,
        params: CommentQueryParams = {}
    ): Promise<CommentPaginatedResponse["data"]> => {
        const res = await apiClient.get<CommentPaginatedResponse>(
            `/comments/project/${projectId}`,
            { params }
        );

        return res.data.data;
    },

    /* -------- Mutations -------- */

    createComment: async (
        data: CreateCommentInput
    ): Promise<Comment> =>
        unwrap(
            await apiClient.post<CommentResponse>("/comments", data)
        ),

    deleteComment: async (
        commentId: string
    ): Promise<{ success: true }> =>
        unwrap(
            await apiClient.delete<
                BaseApiResponse<{ success: true }>
            >(`/comments/${commentId}`)
        ),
};
