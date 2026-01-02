
import prisma from "../../config/prisma.js";
import { ServiceResponse } from "../../types/serviceResponse.js";
import { SearchParams } from "../../types/search-params.js";

export interface CreateChatDTO {
    participants: string[];
}

export class ChatService {
    static async createChat(data: CreateChatDTO): Promise<ServiceResponse> {
        if (data.participants.length < 2) return { success: false, error: "Minimum 2 participants required" };

        const existingChat = await prisma.chat.findFirst({
            where: {
                AND: data.participants.map(id => ({
                    participants: { some: { userId: id } }
                }))
            }
        });

        if (existingChat) return { success: true, data: existingChat };

        const chat = await prisma.chat.create({
            data: {
                participants: {
                    createMany: {
                        data: data.participants.map((userId) => ({ userId })),
                    },
                },
            },
        });

        return { success: true, data: chat };
    }

    static async getChatById(id: string, userId: string): Promise<ServiceResponse> {
        const chat = await prisma.chat.findFirst({
            where: { id },
            include: {
                participants: { include: { user: { select: { name: true, avatar: true, uId: true, id: true } } } },
                messages: { take: 50, orderBy: { createdAt: 'asc' }, include: { sender: { select: { name: true, avatar: true } } } }
            },
        });

        if (!chat) return { success: false, error: "Chat not found" };
        if (!chat.participants.some(p => p.userId === userId)) return { success: false, error: "Unauthorized" };

        return { success: true, data: chat };
    }

    static async getAllChats(userId: string, params: any = {}): Promise<ServiceResponse> {
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 15;
        const skip = (page - 1) * limit;

        const [chats, total] = await Promise.all([
            prisma.chat.findMany({
                where: { participants: { some: { userId } } },
                include: {
                    participants: { include: { user: { select: { name: true, avatar: true, uId: true, id: true } } } },
                    messages: { take: 1, orderBy: { createdAt: 'desc' } }
                },
                orderBy: { updatedAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.chat.count({
                where: { participants: { some: { userId } } }
            })
        ]);

        const hasNextPage = page * limit < total;

        return { 
            success: true, 
            data: { 
                chats, 
                pagination: { total, page, limit, hasNextPage } 
            } 
        };
    }

    static async deleteChat(payload: { chatId: string, userId: string }): Promise<ServiceResponse> {
        const deleted = await prisma.chat.deleteMany({
            where: {
                id: payload.chatId,
                participants: { some: { userId: payload.userId } },
            },
        });
        if (deleted.count === 0) return { success: false, error: "Deletion failed" };
        return { success: true, data: { chatId: payload.chatId } };
    }

    static async addParticipant(payload: { chatId: string, userId: string }): Promise<ServiceResponse> {
        const chat = await prisma.chat.findUnique({ where: { id: payload.chatId } });
        if (!chat) return { success: false, error: "Chat not found" };

        const participant = await (prisma as any).participant.create({
            data: {
                chatId: payload.chatId,
                userId: payload.userId,
            },
        });
        return { success: true, data: participant };
    }

    static async removeParticipant(payload: { chatId: string, userId: string }): Promise<ServiceResponse> {
        const deleted = await (prisma as any).participant.deleteMany({
            where: {
                chatId: payload.chatId,
                userId: payload.userId,
            },
        });
        if (deleted.count === 0) return { success: false, error: "Participant not found" };
        return { success: true, data: { chatId: payload.chatId, userId: payload.userId } };
    }
}
