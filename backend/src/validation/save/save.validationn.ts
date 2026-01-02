
import z from "zod";
import { objectId } from "../common/objectId.js";

export const SaveValidation = {
    getSavedUsers: z.object({
        // saverId usually comes from token, but if passed in body:
        body: z.object({
            saverId: objectId.optional()
        })
    }),

    getSavedMatch: z.object({
        body: z.object({
            saverId: objectId.optional()
        })
    }),

    toggleUserSave: z.object({
        params: z.object({
            userId: objectId
        })
    }),

    toggleSaveMatch: z.object({
        params: z.object({
            matchId: objectId
        })
    }),
}
