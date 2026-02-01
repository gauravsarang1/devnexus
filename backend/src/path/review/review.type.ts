import { ReviewTargetType } from "@prisma/client";
import { Review } from "@prisma/client";

export interface CreateReviewDTO {
    reviewerId: string;
    targetType: ReviewTargetType
    targetId: string;
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