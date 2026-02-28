import { Review } from "@prisma/client";

export interface CreateReviewDTO {
    reviewerId: string;
    userId?: string | null;
    projectId?: string | null;
    rating: number;
    comment: string;
}

export interface ReviewResponse extends Review{
    reviewer: {
        id: string;
        uId: string;
        name: string;
        avatar: string | null;
    };
}

export interface UserReviewsResponse {
    reviews: ReviewResponse[];
    averageRating: number;
    totalReviews: number;
}