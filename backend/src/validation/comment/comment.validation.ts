import z from "zod";
import { objectId } from "../common/objectId.js";

export const CommentValidation = {
    createComment: z.object({
        body: z.object({
            postId: objectId.optional(),
            projectId: objectId.optional(),
            parentCommentId: objectId.optional(),
            content: z.string().min(1).max(2000),
        }).refine(
            d => !!d.postId !== !!d.projectId,
            { message: "Provide either postId or projectId" }
        ),
    }),

    getComments: z.object({
        params: z.object({
            postId: objectId.optional(),
            projectId: objectId.optional(),
        }).refine(
            d => !!d.postId !== !!d.projectId,
            { message: "Provide either postId or projectId" }
        ),
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
        }),
    }),

    deleteComment: z.object({
        params: z.object({
            commentId: objectId,
        }),
    }),
};
