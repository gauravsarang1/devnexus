
import { Request, Response, NextFunction } from "express";
import { NotificationService } from "./notification.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const notificationController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const response = await NotificationService.getNotifications(userId, (req as any).query);
            return successResponse(res, response.data, "Notifications retrieved");
        } catch (error) { next(error); }
    },

    getUnreadCount: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const response = await NotificationService.getUnreadCount(userId);
            return successResponse(res, response.data, "Unread count retrieved");
        } catch (error) { next(error); }
    },

    markRead: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { id } = (req as any).params;
            const response = await NotificationService.markAsRead(id, userId);
            if (!response.success) return errorResponse(res, response.error || "Update failed", 400);
            return successResponse(res, null, "Notification marked as read");
        } catch (error) { next(error); }
    },

    markAllRead: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            await NotificationService.markAllAsRead(userId);
            return successResponse(res, null, "All notifications marked as read");
        } catch (error) { next(error); }
    }
};
