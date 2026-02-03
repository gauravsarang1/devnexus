import z from "zod";
import { objectId } from "../common/objectId.js";

export const SaveValidation = {
    toggleSave: z.object({
        body: z
            .object({
                postId: objectId.optional(),
                projectId: objectId.optional()
            })
            .superRefine((data, ctx) => {
                const targets = [
                    data.postId,
                    data.projectId
                ].filter(Boolean);

                if (targets.length !== 1) {
                    ctx.addIssue({
                        path: [],
                        message:
                            "Exactly one of postId or projectId is required",
                        code: z.ZodIssueCode.custom
                    });
                }
            })
    })
};
