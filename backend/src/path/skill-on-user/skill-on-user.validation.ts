
import z from "zod"
import { objectId } from "../../common/zod/objectId.js";

export const SkillOnUserValidation = {
    getSkillOnUserById: z.object({
        params: z.object({
            skillOnUserId: objectId
        })
    }),

    getSkillsOnUserByUserId: z.object({
        params: z.object({
            userId: objectId
        })
    }),

    getMatchingSkills: z.object({
        params: z.object({
            otherUserId: objectId
        })
    }),

    createSkillOnUser: z.object({
        body: z.object({
            skillId: objectId.optional(),
            skillName: z.string().min(2).optional(),
            role: z.enum(['TEACH', 'LEARN']),
            level: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']),
            note: z.string().optional()
        })
    }),

    updateSkillOnUser: z.object({
        params: z.object({
            skillOnUserId: objectId
        }),
        body: z.object({
            role: z.enum(['TEACH', 'LEARN']).optional(),
            level: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']).optional(),
            note: z.string().optional()
        })
    }),

    deleteSkillOnUser: z.object({
        params: z.object({
            skillOnUserId: objectId
        })
    }),
}
