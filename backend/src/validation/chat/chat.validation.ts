
import z from 'zod';
import { objectId } from '../common/objectId.js';

export const createChatSchema = z.object({
    body: z.object({
        participantsIds: z.array(objectId).min(1, { message: 'At least one participant is required to create a chat' }),
    }),
});

export const getChatByIdSchema = z.object({
    params: z.object({
        id: objectId,
    }),
});

export const getAllChatsSchema = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        search: z.string().optional(),
    }),
});

export const deleteChatSchema = z.object({
    params: z.object({
        id: objectId,
    }),
});

export const addParticipantSchema = z.object({
    body: z.object({
        chatId: objectId,
        userId: objectId,
    }),
});

export const removeParticipantSchema = z.object({
    body: z.object({
        chatId: objectId,
        userId: objectId,
    }),
});
