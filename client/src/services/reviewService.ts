import { CreateReviewDTO, Review } from "../types";
import { BaseApiResponse, PaginatedResponse } from "../utils/apiResponse";
import apiClient from "./apiClient";
import { unwrap } from "../utils/apiHelper";

export type ReviewResponse = BaseApiResponse<Review>;
export type ReviewsPaginatedResponse = PaginatedResponse<Review, 'reviews'>;
export type UpdateReviewDTO = Partial<CreateReviewDTO>;

export const reviewService = {
    getReviewsForProfile: async (userId: string): Promise<ReviewsPaginatedResponse['data']> => 
        unwrap(
            await apiClient.get<BaseApiResponse<any>>(`/reviews/user/${userId}?page=1&limit=5`)
        ),

    getAllUserReviews: async (userId: string, params: URLSearchParams): Promise<ReviewsPaginatedResponse['data']> => {
        const result = await apiClient.get<ReviewsPaginatedResponse>(`/reviews/user/${userId}?${params.toString()}`)
        return result.data.data;
    },

    getStats: async (userId: string): Promise<any> => 
        unwrap(
            await apiClient.get<BaseApiResponse<any>>(`/reviews/user/${userId}/stats`)
        ),

    getReview: async (reviewId: string): Promise<Review> =>
        unwrap(
            await apiClient.post<ReviewResponse>(`/reviews/${reviewId}`)
        ),

    createReview: async (data: CreateReviewDTO): Promise<Review> =>
        unwrap(
            await apiClient.post<ReviewResponse>(`/reviews`, data)
        ),

    updateReview: async (reviewId: string, data: UpdateReviewDTO): Promise<Review> =>
        unwrap(
            await apiClient.put<ReviewResponse>(`/reviews/${reviewId}`, data)
        ),

    deleteReview: async (reviewId: string): Promise<void> => {
        await apiClient.post<ReviewResponse>(`/reviews/${reviewId}`);
    }
}