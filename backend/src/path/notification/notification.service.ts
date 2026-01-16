
import prisma from "../../config/prisma.js";
// Service methods return raw data or throw errors; controllers handle HTTP responses
import { NotFoundError } from '../../errors/NotFoundError.js';
import {
    NotificationDTO,
    NotificationResponse,
    NotificationListResponse,
} from '../../types/service.types.js';

export class NotificationService {
    static async createNotification(data: NotificationDTO): Promise<NotificationResponse> {
        const notification = await prisma.notification.create({ data: { ...data, payload: data.payload ? JSON.stringify(data.payload) : null } });
        return notification;
    }

    static async getNotifications(userId: string, params: any = {}): Promise<NotificationListResponse & { pagination: { total: number; page: number; limit: number; hasNextPage: boolean } }> {
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

        return { notifications, pagination: { total, page, limit, hasNextPage } } as NotificationListResponse & { pagination: { total: number; page: number; limit: number; hasNextPage: boolean } };
    }

    static async markAsRead(id: string, userId: string): Promise<null> {
        const notification = await prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true }
        });
        if (notification.count === 0) throw new NotFoundError("Notification not found");
        return null;
    }

    static async markAllAsRead(userId: string): Promise<null> {
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
        return null;
    }

    static async getUnreadCount(userId: string): Promise<{ count: number }> {
        const count = await prisma.notification.count({
            where: { userId, isRead: false }
        });
        return { count };
    }
}
