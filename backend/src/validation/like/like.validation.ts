import z from "zod";
import { objectId } from "../common/objectId.js";
import { Like_Type } from "@prisma/client";

export const LikeValidation = {
    toggleLike: z.object({
        body: z
            .object({
                likeType: z.nativeEnum(Like_Type),
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
    })
};
