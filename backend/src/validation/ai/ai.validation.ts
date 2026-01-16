import { objectId } from '../common/objectId.js';
import z from 'zod';

export const AiValidation = {
    suggestSearch: z.object({
        body: z.object({
            query: z.string().min(3),
        })
    }),

    suggestUids: z.object({
        body: z.object({
            input: z.string().min(4),
        })
    }),

    refineBio: z.object({
        body: z.object({
            name: z.string().optional(),
            bio: z.string().min(10),
        })
    }),

    refineMessage: z.object({
        body: z.object({
            text: z.string().min(5),
        })
}),

    askAssistant: z.object({
        body: z.object({
            question: z.string().min(5),
        })
    }),

    coachChat: z.object({
        body: z.object({
            messages: z.array(
                z.object({
                    role: z.enum(['user', 'assistant', 'system']),
                    content: z.string().min(1),
                })
            ).min(1),
        })
    }),
}