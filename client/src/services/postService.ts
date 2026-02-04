import apiClient from './apiClient';
import { unwrap } from '../utils/apiHelper';
import {
    BaseApiResponse,
    PaginatedResponse,
} from '../utils/apiResponse';
import { Post } from '../types/index';

// ---------------- types ----------------

export type PostPaginatedResponse = PaginatedResponse<Post, 'posts'>;
export type PostResponse = BaseApiResponse<Post>;

export type MentionInput = {
    userId?: string;
    projectId?: string;
};

export type CreatePostInput = {
    content: string;
    mentionsOnPost?: MentionInput[];
};

export type UpdatePostInput = {
    content?: string;
    mentionsOnPost?: MentionInput[];
};

export type FeedParams = {
    page?: number;
    limit?: number;
    search?: string;
};

// ---------------- service ----------------

export const postService = {
    // -------- Feeds --------

    getGlobalFeed: async (
        params: FeedParams = {}
    ): Promise<PostPaginatedResponse['data']> => {
        const res = await apiClient.get<PostPaginatedResponse>('/posts', {
            params,
        });
        return res.data.data;
    },

    getPersonalizedFeed: async (
        params: FeedParams = {}
    ): Promise<PostPaginatedResponse['data']> => {
        const res = await apiClient.get<PostPaginatedResponse>(
            '/posts/personalized',
            { params }
        );
        return res.data.data;
    },

    getTrendingFeed: async (
        params: FeedParams = {}
    ): Promise<PostPaginatedResponse['data']> => {
        const res = await apiClient.get<PostPaginatedResponse>(
            '/posts/trending',
            { params }
        );
        return res.data.data;
    },

    // -------- Queries --------

    getPostById: async (postId: string): Promise<Post> =>
        unwrap(
            await apiClient.get<PostResponse>(`/posts/${postId}`)
        ),

    getPostsByAuthor: async (
        authorId: string,
        params: FeedParams = {}
    ): Promise<PostPaginatedResponse['data']> => {
        const res = await apiClient.get<PostPaginatedResponse>(
            `/posts/author/${authorId}`,
            { params }
        );
        return res.data.data;
    },

    // -------- Mutations --------

    createPost: async (data: CreatePostInput): Promise<Post> =>
        unwrap(
            await apiClient.post<PostResponse>('/posts', data)
        ),

    updatePost: async (
        postId: string,
        data: UpdatePostInput
    ): Promise<Post> =>
        unwrap(
            await apiClient.put<PostResponse>(
                `/posts/${postId}`,
                data
            )
        ),

    deletePost: async (postId: string): Promise<{ success: true }> =>
        unwrap(
            await apiClient.delete<BaseApiResponse<{ success: true }>>(
                `/posts/${postId}`
            )
        ),
};
