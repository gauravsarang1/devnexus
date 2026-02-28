
import { Request, Response, NextFunction } from "express";
import { NotificationService } from "./notification.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const notificationController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const data = await NotificationService.getNotifications(userId, req.query);
            return successResponse(res, data, "Notifications retrieved");
        } catch (error) { next(error); }
    },

    getUnreadCount: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const data = await NotificationService.getUnreadCount(userId);
            return successResponse(res, data, "Unread count retrieved");
        } catch (error) { next(error); }
    },

    markRead: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { id } = req.validated!.params;
            await NotificationService.markAsRead(id, userId);
            return successResponse(res, null, "Notification marked as read");
        } catch (error) { next(error); }
    },

    markAllRead: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            await NotificationService.markAllAsRead(userId);
            return successResponse(res, null, "All notifications marked as read");
        } catch (error) { next(error); }
    }
};
