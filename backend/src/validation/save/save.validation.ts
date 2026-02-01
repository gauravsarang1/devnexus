import z from "zod";
import { objectId } from "../common/objectId.js";
import { Save_Type } from "@prisma/client";

export const SaveValidation = {
    toggleSave: z.object({
        body: z
            .object({
                saveType: z.nativeEnum(Save_Type),
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
