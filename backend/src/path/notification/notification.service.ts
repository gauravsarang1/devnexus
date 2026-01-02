
import prisma from "../../config/prisma.js";
import { ServiceResponse } from "../../types/serviceResponse.js";

export interface CreateNotificationDTO {
    userId: string;
    type: 'CHAT' | 'MATCH_REQUEST' | 'MATCH_ACCEPTED' | 'SYSTEM' | 'SKILL_UPDATE';
    title: string;
    message: string;
    link: string;
    payload?: any;
}

export class NotificationService {
    static async createNotification(data: CreateNotificationDTO): Promise<ServiceResponse> {
        const notification = await prisma.notification.create({
            data: {
                ...data,
                payload: data.payload ? JSON.stringify(data.payload) : null
            }
        });
        return { success: true, data: notification };
    }

    static async getNotifications(userId: string, params: any = {}): Promise<ServiceResponse> {
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 15;
        const skip = (page - 1) * limit;

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.notification.count({ where: { userId } })
        ]);

        const hasNextPage = page * limit < total;

        return {
            success: true,
            data: {
                notifications,
                pagination: { total, page, limit, hasNextPage }
            }
        };
    }

    static async markAsRead(id: string, userId: string): Promise<ServiceResponse> {
        const notification = await prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true }
        });
        if (notification.count === 0) return { success: false, error: "Notification not found" };
        return { success: true };
    }

    static async markAllAsRead(userId: string): Promise<ServiceResponse> {
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
        return { success: true };
    }

    static async getUnreadCount(userId: string): Promise<ServiceResponse> {
        const count = await prisma.notification.count({
            where: { userId, isRead: false }
        });
        return { success: true, data: { count } };
    }
}
