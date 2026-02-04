import z from "zod";
import { objectId } from "../../common/objectId.js";

const paginationQuery = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
});

const skillIdsSchema = z.array(objectId).min(1);

export const ProjectValidation = {
    create: z.object({
        body: z.object({
            title: z.string().min(3, "Title must be at least 3 characters"),
            description: z.string().min(10, "Description must be at least 10 characters"),
            slug: z.string().min(1, "Slug must be at least 1 characters"),
            tagline: z.string().optional(),
            githubUrl: z.string().url().optional(),
            previewUrl: z.string().url().optional(),
            skillIds: skillIdsSchema.optional(),
        }),
    }),

    update: z.object({
        params: z.object({
            projectId: objectId,
        }),
        body: z.object({
            title: z.string().min(3).optional(),
            description: z.string().min(10).optional(),
            slug: z.string().min(1).optional(),
            tagline: z.string().optional(),
            githubUrl: z.string().url().optional(),
            previewUrl: z.string().url().optional(),
            skillIds: skillIdsSchema.optional(),
        }).refine(
            (data) => Object.keys(data).length > 0,
            { message: "At least one field is required to update" }
        ),
    }),

    getById: z.object({
        params: z.object({
            projectId: objectId,
        }),
    }),

    getBySlug: z.object({
        params: z.object({
            slug: z.string().min(1, "Slug is required"),
        }),
    }),

    delete: z.object({
        params: z.object({
            projectId: objectId,
        }),
    }),

    getByUserId: z.object({
        params: z.object({
            userId: objectId,
        }),
        query: paginationQuery,
    }),

    getAllProjects: z.object({
        query: paginationQuery,
    }),

    getPersonalizedFeed: z.object({
        query: paginationQuery,
    }),

    getTrendingProjects: z.object({
        query: paginationQuery,
    }),
};
