
import prisma from '../../config/prisma.js'
import { BadRequestError } from '../../errors/BadRequestError.js'
import { NotFoundError } from '../../errors/NotFoundError.js'
import io from '../../sockets/socketHandlers.js'
import { MessageNotifier } from './message.notification.js';
import {
  SendMessageDTO,
  MessageResponse,
  MessageSocketPayload,
  GetMessagesResponse,
  EditMessageDTO,
  SeenByDTO,
  MarkChatAsSeenDTO,
} from '../../types/service.types.js';
import { MessageStatus } from '@prisma/client';

export class MessageService {
    static async sendMessage(payload: {
        chatId: string, senderId: string, text: string
    }): Promise<MessageSocketPayload> {
        const existingChat = await prisma.chat.findUnique({
            where: {
                id: payload.chatId
            },
            include: {
                participants: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (!existingChat) {
            throw new NotFoundError("Chat does not exist");
        }

        const isUserExistsInChat = existingChat.participants.some( p => p.userId === payload.senderId);
        if(!isUserExistsInChat) {
            throw new BadRequestError("Unauthorized: You are not a participant of this chat");
        }

        const message = await prisma.message.create({
            data: {
                chatId: payload.chatId,
                senderId: payload.senderId,
                text: payload.text,
                status: 'SENT'
            },
            include: {
                user: { select: { name: true, photo: true, uId: true } }
            }
        });

        // Format for socket consistent with frontend expectation
        const socketPayload = {
            ...message,
            sender: {
                name: message.user.name,
                avatar: message.user.photo.find(p => p.type === "AVATAR")?.url!,
                uId: message.user.uId!
            }
        };

        await prisma.chat.update({
            where: { id: payload.chatId },
            data: { updatedAt: new Date() }
        });

        const reciverId = existingChat.participants.find((p) => p.userId !== payload.senderId)?.userId!;
        MessageNotifier.sendMessage({
            message,
            chatId: message.chatId,
            reciverId,
            socketPayload
        });

        return socketPayload;
    };

    static async getMessagesByChatId(payload: { chatId: string, query?: any }): Promise<GetMessagesResponse> {
        const page = Number(payload.query?.page) || 1;
        const limit = Number(payload.query?.limit) || 30;
        const skip = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            prisma.message.findMany({
                where: { chatId: payload.chatId },
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true, photo: true, uId: true } }
                },
                skip,
                take: limit
            }),
            prisma.message.count({ where: { chatId: payload.chatId } })
        ]);

        const hasNextPage = page * limit < total;

        const formatted = messages.map(m => ({
            ...m,
            sender: m.user
        }));

        return {
                messages: formatted.reverse(),
                pagination: { total, page, limit, hasNextPage }
        };
    };

    // Fixed: Added implementation for deleteMessage
    static async deleteMessage(payload: { messageId: string, userId: string }): Promise<{ id: string }> {
        const message = await prisma.message.findUnique({ where: { id: payload.messageId } });
        if (!message) throw new NotFoundError("Message not found");
        if (message.senderId !== payload.userId) throw new BadRequestError("Unauthorized");

        await prisma.message.delete({ where: { id: payload.messageId } });
        io.to(message.chatId).emit('message:delete', { messageId: payload.messageId, userId: payload.userId, chatId: message.chatId });
        return { id: payload.messageId };
    }

    // Fixed: Added implementation for editMessage
    static async editMessage(payload: { messageId: string, newText: string, userId: string }): Promise<MessageResponse> {
        const message = await prisma.message.findUnique({ where: { id: payload.messageId } });
        if (!message) throw new NotFoundError("Message not found");
        if (message.senderId !== payload.userId) throw new BadRequestError("Unauthorized");

        const updated = await prisma.message.update({
            where: { id: payload.messageId },
            data: { text: payload.newText },
            include: { user: { select: { name: true, photo: true, uId: true } } }
        });

        const socketPayload = {
            ...updated,
            sender: updated.user
        };

        io.to(message.chatId).emit('message:edit', socketPayload as any);
        return socketPayload ;
    }

    static async changeMessageStatus(payload: { messageId: string, status: MessageStatus }): Promise<MessageResponse> {
        const message = await prisma.message.update({
            where: { id: payload.messageId },
            data: { status: payload.status },
        });

        io.to(message.chatId).emit('message:status', { messageId: message.id, status: payload.status });
        return message ;
    };

    static async seenBy(payload: { messageId: string, userId: string }): Promise<MessageResponse> {
        const existingMessage = await prisma.message.findUnique({
            where: { id: payload.messageId },
            include: { chat: { include: { participants: true } } }
        });

        if (!existingMessage) throw new NotFoundError("Message does not exist");

        const isUserExistsInChat = existingMessage.chat.participants.some(p => p.userId === payload.userId);
        if (!isUserExistsInChat) throw new BadRequestError("Unauthorized");

        const dataToUpdate: any = { seenBy: { push: payload.userId } };
        if (payload.userId !== existingMessage.senderId) {
            dataToUpdate.status = 'READ';
        }

        const message = await prisma.message.update({ 
            where: { id: payload.messageId }, 
            data: dataToUpdate 
        });

        io.to(message.chatId).emit('message:seen', { messageId: payload.messageId, userId: payload.userId, chatId: message.chatId });
        return message ;
    };

    static async markChatAsSeen(payload: { chatId: string, userId: string }): Promise<null> {
        await prisma.message.updateMany({
            where: {
                chatId: payload.chatId,
                senderId: { not: payload.userId },
                status: { not: 'READ' }
            },
            data: {
                status: 'READ'
            }
        });

        io.to(payload.chatId).emit('chat:seen', { chatId: payload.chatId, userId: payload.userId });
        return null;
    }

    static async getAllChats(): Promise<any> {
        const messages = await prisma.message.findMany({});
        return messages;
    }
}
