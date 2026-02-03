import z from "zod";
import { objectId } from "../common/objectId.js";

export const ProjectValidation = {
    create: z.object({
        body: z.object({
            title: z.string().min(3),
            description: z.string().min(10),
            tagline: z.string().optional(),
            githubUrl: z.string().url().optional(),
            previewUrl: z.string().url().optional(),
        }),
    }),

    update: z.object({
        params: z.object({ projectId: objectId }),
        body: z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            tagline: z.string().optional(),
        }),
    }),

    getById: z.object({
        params: z.object({ projectId: objectId }),
    }),

    delete: z.object({
        params: z.object({ projectId: objectId }),
    }),
};
