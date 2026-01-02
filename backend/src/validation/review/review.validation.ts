
import z from "zod";
import { objectId } from "../common/objectId.js";

export const ReviewValidation = {
    getReviews: z.object({
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional()
        })
    }),

    reviewById: z.object({
        params: z.object({
            reviewId: objectId
        })
    }),

    createReview: z.object({
        body: z.object({
            reviewedUserId: objectId,
            comment: z.string().optional(),
            rating: z.number().min(1).max(5)
        })
    }),

    editReview: z.object({
        params: z.object({
            reviewId: objectId
        }),
        body: z.object({
            comment: z.string().optional(),
            rating: z.number().min(1).max(5).optional()
        })
    }),

    deleteReview: z.object({
        params: z.object({
            reviewId: objectId
        })
    }),

    reviewsByReviewedUserId: z.object({
        params: z.object({
            reviewedUserId: objectId
        }),
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional()
        })
    }),

    reviewsByReviewerId: z.object({
        params: z.object({
            reviewerId: objectId
        }),
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional()
        })
    })
};
