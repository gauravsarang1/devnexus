
import z from "zod";
import { objectId } from "../common/objectId.js";
import { ReviewTargetType } from "@prisma/client";

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
        body: z
            .object({
                userId: objectId.optional(),
                postId: objectId.optional(),
                projectId: objectId.optional(),
                targetType: z.nativeEnum(ReviewTargetType),
                comment: z.string().optional(),
                rating: z.number().min(1).max(5),
            })
            .superRefine((data, ctx) => {
                switch (data.targetType) {
                    case ReviewTargetType.USER:
                        if (!data.userId) {
                            ctx.addIssue({
                                path: ['userId'],
                                message: 'userId is required when targetType is USER',
                                code: z.ZodIssueCode.custom,
                            });
                        }
                        break;

                    case ReviewTargetType.POST:
                        if (!data.postId) {
                            ctx.addIssue({
                                path: ['postId'],
                                message: 'postId is required when targetType is POST',
                                code: z.ZodIssueCode.custom,
                            });
                        }
                        break;

                    case ReviewTargetType.PROJECT:
                        if (!data.projectId) {
                            ctx.addIssue({
                                path: ['projectId'],
                                message: 'projectId is required when targetType is PROJECT',
                                code: z.ZodIssueCode.custom,
                            });
                        }
                        break;
                }
            }),
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

    getAllReviews: z.object({
        params: z.object({
            targetId: objectId,
            targetType: z.nativeEnum(ReviewTargetType)
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
