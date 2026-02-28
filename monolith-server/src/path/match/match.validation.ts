
import z from "zod";
import { objectId } from "../../common/zod/objectId.js";

export const MatchValidation = {
    getMatchById: z.object({
        params: z.object({
            matchId: objectId,
        }),
    }),

    getAllMatches: z.object({
        query: z.object({
            type: z.string().optional(),
            page: z.string().optional(),
            limit: z.string().optional(),
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
