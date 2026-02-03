import z from "zod";
import { objectId } from "../common/objectId.js";

export const PostValidation = {
    createPost: z.object({
        body: z.object({
            content: z
                .string()
                .min(1, "Post content cannot be empty")
                .max(5000, "Post content is too long"),

            mentionsOnPost: z
                .array(
                    z.object({
                        userId: objectId.optional(),
                        projectId: objectId.optional(),
                    })
                )
                .optional()
        })
            .superRefine((data, ctx) => {
                if (!data.mentionsOnPost) return;

                data.mentionsOnPost.forEach((mention, index) => {
                    const hasUser = !!mention.userId;
                    const hasProject = !!mention.projectId;

                    if (hasUser === hasProject) {
                        ctx.addIssue({
                            path: ["mentionsOnPost", index],
                            message:
                                "Exactly one of userId or projectId must be provided",
                            code: z.ZodIssueCode.custom
                        });
                    }
                });
            })
    }),

    updatePost: z.object({
        params: z.object({
            postId: objectId
        }),
        body: z
            .object({
                content: z
                    .string()
                    .min(1)
                    .max(5000)
                    .optional(),

                mentionsOnPost: z
                    .array(
                        z.object({
                            userId: objectId.optional(),
                            projectId: objectId.optional(),
                        })
                    )
                    .optional()
            })
            .superRefine((data, ctx) => {
                if (!data.mentionsOnPost) return;

                data.mentionsOnPost.forEach((mention, index) => {
                    const hasUser = !!mention.userId;
                    const hasProject = !!mention.projectId;

                    if (hasUser === hasProject) {
                        ctx.addIssue({
                            path: ["mentionsOnPost", index],
                            message:
                                "Exactly one of userId or projectId must be provided",
                            code: z.ZodIssueCode.custom
                        });
                    }
                });
            })
    }),

    getPostById: z.object({
        params: z.object({
            postId: objectId
        })
    }),

    getPostsByAuthor: z.object({
        params: z.object({
            authorId: objectId
        }),
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
            search: z.string().optional()
        })
    }),

    getPosts: z.object({
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
            search: z.string().optional()
        })
    }),

    deletePost: z.object({
        params: z.object({
            postId: objectId
        })
    })
};
