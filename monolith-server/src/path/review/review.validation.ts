import z from "zod";
import { objectId } from "../../common/zod/objectId.js";

export const ReviewValidation = {
    getReviews: z.object({
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
            reviewerId: objectId.optional(),
            reviewedUserId: objectId.optional(),
        }),
    }),

    reviewById: z.object({
        params: z.object({
            reviewId: objectId,
        }),
    }),

    createReview: z.object({
        body: z
            .object({
                userId: objectId.optional(),
                projectId: objectId.optional(),
                comment: z.string().optional(),
                rating: z.number().min(1).max(5),
            })
            .refine(
                (data) => !!data.userId !== !!data.projectId,
                {
                    message: "Provide either userId or projectId (not both)",
                    path: ["userId"],
                }
            ),
    }),

    editReview: z.object({
        params: z.object({
            reviewId: objectId,
        }),
        body: z.object({
            comment: z.string().optional(),
            rating: z.number().min(1).max(5).optional(),
        }),
    }),

    deleteReview: z.object({
        params: z.object({
            reviewId: objectId,
        }),
    }),

    getAllReviews: z.object({
        params: z.object({
            userId: objectId.optional(),
            projectId: objectId.optional(),
        })
        .refine(
            (data) => !!data.userId !== !!data.projectId,
            {
                message: "Provide either userId or projectId",
            }
        ),
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
        }),
    }),

    getStats: z.object({
        params: z.object({
            userId: objectId,
        }),
    }),
};
