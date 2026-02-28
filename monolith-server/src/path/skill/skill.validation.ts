
import z from "zod";
import { objectId } from "../../common/zod/objectId.js";

export const SkillValidation = {
    skillById: z.object({
        params: z.object({
            skillId: objectId
        })
    }),

    createSkill: z.object({
        body: z.object({
            name: z.string().min(1),
            description: z.string().optional(),
            slug: z.string().optional(),
            icon: z.string().optional()
        })
    }),

    updateSkill: z.object({
        params: z.object({
            skillId: objectId
        }),
        body: z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            slug: z.string().optional(),
            icon: z.string().optional()
        })
    }),

    deleteSkill: z.object({
        params: z.object({
            skillId: objectId
        })
    })
};
