import z from "zod";
import { objectId } from "../common/objectId.js";

export const SaveValidation = {
    toggleSave: z.object({
        body: z
            .object({
                postId: objectId.optional(),
                projectId: objectId.optional()
            })
            .refine(
                (data) => !(data.postId && data.projectId),
                {
                    message: "Provide either postId or projectId, not both",
                }
            ),
    }),

    getAllSaves: z.object({
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
            saveType: z.enum(["POST", "PROJECT"]).optional()
        })
    })

};
