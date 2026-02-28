import prisma from "../../config/prisma.js";
// Service methods return raw data or throw errors; controllers handle HTTP responses
import { BadRequestError } from '../../errors/BadRequestError.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
import { getCache, setCache } from "../../utils/cache.js";
import {
    CreateChatDTO,
    ChatDetail,
    ChatPreview,
    AllChatsResponse,
    UserProfilePreview,
} from "../../types/service.types.js";

export class ChatService {
    static async createChat(data: CreateChatDTO): Promise<ChatPreview> {
        if (data.participants.length < 2) throw new BadRequestError("Minimum 2 participants required");

        const existingChat = await prisma.chat.findFirst({
            where: {
                AND: data.participants.map((id) => ({
                    participants: { some: { userId: id } },
                })),
            },
        });

        if (existingChat) return existingChat as ChatPreview;

        const chat = await prisma.chat.create({
            data: {
                participants: {
                    createMany: {
                        data: data.participants.map((userId) => ({ userId })),
                    },
                },
            },
        });

        return chat as ChatPreview;
    }

    static async getChatById(
        id: string,
        userId: string
    ): Promise<ChatDetail> {
        const chat = await prisma.chat.findFirst({
            where: { id },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                name: true, photo: {
                                    where: {
                                        type: 'AVATAR'
                                    },
                                    take: 1
                                }, 
                                uId: true, 
                                id: true
                            }
                        },
                    },
                },
                messages: {
                    take: 50,
                    orderBy: { createdAt: "asc" },
                    include: { user: { select: { name: true, photo: true } } },
                },
            },
        });

        if (!chat) throw new NotFoundError("Chat not found");
        if (!chat.participants.some((p) => p.userId === userId)) throw new BadRequestError("Unauthorized");

        const formattedChat = {
            ...chat,
            participants: chat.participants.map(({ user }) => ({
                ...user,
                avatar: user.photo[0].url ?? null,
            })),
        };

        return formattedChat as ChatDetail;
    }

    static async getAllChats(
        userId: string,
        params: any = {}
    ): Promise<AllChatsResponse> {

        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 15;
        const skip = (page - 1) * limit;

        // ✅ cache key must include pagination
        const cacheKey = `chat:user:${userId}:page:${page}:limit:${limit}`;

        // 1️⃣ Check cache
        const cachedChats = await getCache(cacheKey);
        if (cachedChats) {
            console.log("returned from cache ✅");
            return JSON.parse(cachedChats);
        }

        // 2️⃣ Fetch from DB
        const [chats, total] = await Promise.all([
            prisma.chat.findMany({
                where: { participants: { some: { userId } } },
                include: {
                    participants: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    photo: {
                                        where: {
                                            type: 'AVATAR',
                                        },
                                        take: 1
                                    },
                                    uId: true,
                                    id: true,
                                },
                            },
                        },
                    },
                    messages: {
                        take: 1,
                        orderBy: { createdAt: "desc" },
                    },
                },
                orderBy: { updatedAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.chat.count({
                where: { participants: { some: { userId } } },
            }),
        ]);

        // 3️⃣ Format for frontend
        const formattedChats = chats.map(({ participants, ...chat }) => ({
            ...chat,
            participants: participants.map(({ user }) => ({
                ...user,
                avatar:
                    user.photo[0].url ?? null,
            })),
        }));

        const hasNextPage = page * limit < total;

        const responseData = {
            chats: formattedChats,
            pagination: { total, page, limit, hasNextPage },
        };

        // 4️⃣ Save to cache (SHORT TTL for chats)
        await setCache(cacheKey, responseData, 20); // ⏱ 20 seconds

        return responseData as AllChatsResponse;
    }


    static async deleteChat(payload: {
        chatId: string;
        userId: string;
    }): Promise<null> {
        const deleted = await prisma.chat.deleteMany({
            where: {
                id: payload.chatId,
                participants: { some: { userId: payload.userId } },
            },
        });
        if (deleted.count === 0) throw new NotFoundError("Deletion failed");
        return null;
    }
}
