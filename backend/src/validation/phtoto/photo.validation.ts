
import z from 'zod';
import { objectId } from '../common/objectId.js';

export const PhotoValidation = {
    createPhoto: z.object({
        body: z.object({
            url: z.string().url("Invalid URL format"),
        }),
    }),

    updatePhoto: z.object({
        body: z.object({
            url: z.string().url("Invalid URL format").optional(),
        }),
    }),

    getPhotoById: z.object({
        params: z.object({
            id: objectId,
        }),
    }),

    deletePhoto: z.object({
        params: z.object({
            id: objectId,
        }),
    }),
};
