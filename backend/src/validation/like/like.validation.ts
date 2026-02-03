import z from "zod";
import { objectId } from "../common/objectId.js";

export const LikeValidation = {
    toggleLike: z.object({
        body: z
            .object({
                postId: objectId.optional(),
                projectId: objectId.optional(),
                reviewId: objectId.optional()
            })
            .superRefine((data, ctx) => {
                const targets = [
                    data.postId,
                    data.projectId,
                    data.reviewId
                ].filter(Boolean);

                if (targets.length !== 1) {
                    ctx.addIssue({
                        path: [],
                        message:
                            "Exactly one of postId, projectId, or reviewId is required",
                        code: z.ZodIssueCode.custom
                    });
                }
            })
    }),

    getAll: z.object({
        query: z
            .object({
                postId: objectId.optional(),
                projectId: objectId.optional(),
                reviewId: objectId.optional(),
                page: z.coerce.number().optional(),
                limit: z.coerce.number().optional()
            })
            .superRefine((data, ctx) => {
                const targets = [
                    data.postId,
                    data.projectId,
                    data.reviewId
                ].filter(Boolean);

                if (targets.length !== 1) {
                    ctx.addIssue({
                        path: [],
                        message:
                            "Exactly one of postId, projectId, or reviewId is required",
                        code: z.ZodIssueCode.custom
                    });
                }
            })
    })
};
