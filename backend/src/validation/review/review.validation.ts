
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

    getAllUserReviews: z.object({
        params: z.object({
            userId: objectId
        }),
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional()
        })
    }),

    getStats: z.object({
        params: z.object({
            userId: objectId
        })
    })
};
