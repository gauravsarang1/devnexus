import z from "zod";
import { objectId } from "../common/objectId.js";

const mentionSchema = z
    .object({
        userId: objectId.optional(),
        projectId: objectId.optional(),
    })
    .refine(
        (data) => !!data.userId !== !!data.projectId,
        {
            message: "Exactly one of userId or projectId must be provided",
        }
    );

const paginationQuery = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional()
});

export const PostValidation = {
    createPost: z.object({
        body: z.object({
            content: z
                .string()
                .min(1, "Post content cannot be empty")
                .max(5000, "Post content is too long"),

            mentionsOnPost: z.array(mentionSchema).optional(),
        }),
    }),

    updatePost: z.object({
        params: z.object({
            postId: objectId,
        }),
        body: z.object({
            content: z.string().min(1).max(5000).optional(),
            mentionsOnPost: z.array(mentionSchema).optional(),
        }),
    }),

    getPostById: z.object({
        params: z.object({
            postId: objectId,
        }),
    }),

    getPostsByAuthor: z.object({
        params: z.object({
            authorId: objectId,
        }),
        query: paginationQuery
    }),

    getPosts: z.object({
        query: paginationQuery
    }),

    personalizedFeed: z.object({
        query: paginationQuery
    }),

    trendingFeed: z.object({
        query: paginationQuery
    }),

    deletePost: z.object({
        params: z.object({
            postId: objectId,
        }),
    }),
};
