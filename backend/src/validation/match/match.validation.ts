
import z from "zod";
import { objectId } from "../common/objectId.js";

export const MatchValidation = {
    getMatchById: z.object({
        params: z.object({
            matchId: objectId,
        }),
    }),

    createMatch: z.object({
        body: z.object({
            targetUserId: objectId,
        }),
    }),

    updateStatus: z.object({
        params: z.object({
            matchId: objectId,
        }),
        body: z.object({
            status: z.enum(['ACCEPTED', 'DECLINED'], { message: "Status must be ACCEPTED or DECLINED" }),
        }),
    }),

    getMatchByUserId: z.object({
        params: z.object({
            userId: objectId,
        }),
    }),
};
