
import z from "zod";
import { objectId } from "../../common/zod/objectId.js";

export const MessageValidation = {
    getMessagesByChatId: z.object({
        params: z.object({
            chatId: objectId,
        }),
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
        }),
    }),

    seenByMessage: z.object({
        params: z.object({
            messageId: objectId,
        }),
    }),

    markChatAsSeen: z.object({
        params: z.object({
            chatId: objectId
        })
    }),

    createMessage: z.object({
        body: z.object({
            chatId: objectId,
            text: z.string().min(1, { message: "Message content cannot be empty" }),
        }),
    }),

    editMessage: z.object({
        params: z.object({
            messageId: objectId,
        }),
        body: z.object({
            newText: z.string().min(1, { message: "Message content cannot be empty" }),
        }),
    }),

    changeMessageStatus: z.object({
        params: z.object({
            messageId: objectId,
        }),
        body: z.object({
            status: z.enum(['SENT', 'DELIVERED', 'READ']),
        }),
    }),

    deleteMessage: z.object({
        params: z.object({
            messageId: objectId,
        }),
    }),
};
