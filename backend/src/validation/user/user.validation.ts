
import z from "zod";
import { objectId } from "../common/objectId.js";

export const UserValidation = {
    getUserById: z.object({
        params: z.object({
            userId: z.string() // Could be ID or uId string
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
