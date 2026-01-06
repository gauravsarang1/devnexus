
import prisma from '../../config/prisma.js'
import { ServiceResponse } from '../../types/serviceResponse.js'
import * as PrismaModule from '@prisma/client'
import io from '../../sockets/socketHandlers.js'
import { PushService } from '../../services/pushService.js';
import { NotificationService } from '../notification/notification.service.js';
import { MessageNotifier } from './message.notification.js';

export class MessageService {
    static async sendMessage(payload: {
        chatId: string, senderId: string, text: string
    }): Promise<ServiceResponse> {
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
            return {
                success: false,
                error: "Chat does not exist"
            };
        }

        const isUserExistsInChat = existingChat.participants.some( p => p.userId === payload.senderId);
        if(!isUserExistsInChat) {
            return {
                success: false,
                error: "Unauthorized: You are not a participant of this chat"
            }
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

        return { success: true, data: socketPayload };
    };

    static async getMessagesByChatId(payload: { chatId: string, page?: number, limit?: number }): Promise<ServiceResponse> {
        const page = Number(payload.page) || 1;
        const limit = Number(payload.limit) || 30;
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
            success: true,
            data: {
                messages: formatted.reverse(),
                pagination: { total, page, limit, hasNextPage }
            }
        };
    };

    // Fixed: Added implementation for deleteMessage
    static async deleteMessage(payload: { messageId: string, userId: string }): Promise<ServiceResponse> {
        const message = await prisma.message.findUnique({ where: { id: payload.messageId } });
        if (!message) return { success: false, error: "Message not found" };
        if (message.senderId !== payload.userId) return { success: false, error: "Unauthorized" };

        await prisma.message.delete({ where: { id: payload.messageId } });
        io.to(message.chatId).emit('message:delete', { id: payload.messageId, chatId: message.chatId });
        return { success: true, data: { id: payload.messageId } };
    }

    // Fixed: Added implementation for editMessage
    static async editMessage(payload: { messageId: string, newText: string, userId: string }): Promise<ServiceResponse> {
        const message = await prisma.message.findUnique({ where: { id: payload.messageId } });
        if (!message) return { success: false, error: "Message not found" };
        if (message.senderId !== payload.userId) return { success: false, error: "Unauthorized" };

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
        return { success: true, data: socketPayload };
    }

    static async changeMessageStatus(payload: { messageId: string, status: any }): Promise<ServiceResponse> {
        const message = await prisma.message.update({
            where: { id: payload.messageId },
            data: { status: payload.status },
        });

        io.to(message.chatId).emit('message:status', { messageId: message.id, status: payload.status });
        return { success: true, data: message };
    };

    static async seenBy(payload: { messageId: string, userId: string }): Promise<ServiceResponse> {
        const existingMessage = await prisma.message.findUnique({
            where: { id: payload.messageId },
            include: { chat: { include: { participants: true } } }
        });

        if (!existingMessage) return { success: false, error: "Message does not exist" };

        const isUserExistsInChat = existingMessage.chat.participants.some(p => p.userId === payload.userId);
        if (!isUserExistsInChat) return { success: false, error: "Unauthorized" };

        const dataToUpdate: any = { seenBy: { push: payload.userId } };
        if (payload.userId !== existingMessage.senderId) {
            dataToUpdate.status = 'READ';
        }

        const message = await prisma.message.update({ 
            where: { id: payload.messageId }, 
            data: dataToUpdate 
        });

        io.to(message.chatId).emit('message:seen', { messageId: payload.messageId, userId: payload.userId, chatId: message.chatId });
        return { success: true, data: message };
    };

    static async markChatAsSeen(payload: { chatId: string, userId: string }): Promise<ServiceResponse> {
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
        return { success: true };
    }

    static async getAllChats(): Promise<ServiceResponse> {
        const messages = await prisma.message.findMany({});
        return { success: true, data: messages };
    }
}
