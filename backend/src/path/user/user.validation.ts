
import z, { trim } from "zod";

export const UserValidation = {
    getUserById: z.object({
        params: z.object({
            userIdORuId: z.string().min(4),
        })
    }),

    getMutualSkills: z.object({
        params: z.object({
            otherUserId: z.string().min(24).max(24),
        })
    }),
    
    getAllUsers: z.object({
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
            search: z.string().trim().optional(),
        }).optional()
    }),

    userSubscription: z.object({
        body: z.object({
            subscription: z.any(),
        })
    }),

    updateProfile: z.object({
        body: z.object({
            name: z.string().min(3).max(50).optional(),
            bio: z.string().max(500).optional(),
            uId: z.string().min(4).optional(),
            avatar: z.string().url().optional(),
            background: z.string().url().optional(),
        })
    }),

    changePassword: z.object({
        body: z.object({
            currentPassword: z.string().min(1),
            newPassword: z.string().min(6),
        })
    }),
}
