import { CreateReviewDTO, Review } from "../types";
import { BaseApiResponse, PaginatedResponse } from "../utils/apiResponse";
import apiClient from "./apiClient";
import { unwrap } from "../utils/apiHelper";

export type ReviewResponse = BaseApiResponse<Review>;
export type ReviewsPaginatedResponse = PaginatedResponse<Review, "reviews">;
export type UpdateReviewDTO = {
    comment?: string;
    rating?: number;
};

export const reviewService = {
    /**
     * Get reviews for a user OR project (mutually exclusive)
     * Matches: ReviewValidation.getAllReviews
     */
    getReviews: async (
        params: {
            userId?: string;
            projectId?: string;
            page?: string;
            limit?: string;
        }
    ): Promise<ReviewsPaginatedResponse["data"]> => {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.set("page", params.page);
        if (params.limit) searchParams.set("limit", params.limit);

        const target =
            params.userId
                ? `/reviews/${params.userId}`
                : `/reviews/project/${params.projectId}`;

        const res = await apiClient.get<ReviewsPaginatedResponse>(
            `${target}?${searchParams.toString()}`
        );

        return res.data.data;
    },

    /**
     * Get single review by ID
     * Matches: ReviewValidation.reviewById
     */
    getReviewById: async (reviewId: string): Promise<Review> =>
        unwrap(
            await apiClient.get<ReviewResponse>(`/reviews/${reviewId}`)
        ),

    /**
     * Create review (user OR project, not both)
     * Matches: ReviewValidation.createReview
     */
    createReview: async (data: {
        userId?: string;
        projectId?: string;
        comment?: string;
        rating: number;
    }): Promise<Review> =>
        unwrap(
            await apiClient.post<ReviewResponse>(`/reviews`, data)
        ),

    /**
     * Edit review
     * Matches: ReviewValidation.editReview
     */
    updateReview: async (
        reviewId: string,
        data: UpdateReviewDTO
    ): Promise<Review> =>
        unwrap(
            await apiClient.put<ReviewResponse>(`/reviews/${reviewId}`, data)
        ),

    /**
     * Delete review
     * Matches: ReviewValidation.deleteReview
     */
    deleteReview: async (reviewId: string): Promise<void> => {
        await apiClient.delete(`/reviews/${reviewId}`);
    },

    /**
     * Get review stats for a user
     * Matches: ReviewValidation.getStats
     */
    getStats: async (userId: string): Promise<any> =>
        unwrap(
            await apiClient.get<BaseApiResponse<any>>(
                `/reviews/user/${userId}/stats`
            )
        ),
};
