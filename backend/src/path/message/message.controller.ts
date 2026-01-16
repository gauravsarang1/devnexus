
import { successResponse, errorResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";
import { MessageService } from "./message.service.js";

export const messageController = {
    sendMessage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const senderId = req.userId!;
            const  { chatId, text }  = req.validated!.body!
            const data = await MessageService.sendMessage({ chatId, text, senderId });
            return successResponse(res, data, "Message sent successfully", 201);
        } catch (error) {
            next(error);
        }
    },

    getMessagesByChatId: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { chatId } = req.validated!.params!
            const query = req.validated!.query;
            const data = await MessageService.getMessagesByChatId({
                chatId, 
                query
            });
            return successResponse(res, data, "Messages retrieved successfully");
        } catch (error) {
            next(error);
        }
    },

    deleteMessage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { messageId } = req.validated!.params!
            const data = await MessageService.deleteMessage({ messageId, userId });
            return successResponse(res, data, "Message deleted successfully");
        } catch (error) {
            next(error);
        }
    },

    editMessage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { messageId } = req.validated!.params!
            const { newText } = req.validated!.body!
            const data = await MessageService.editMessage({ messageId, newText, userId });
            return successResponse(res, data, "Message edited successfully");
        } catch (error) {
            next(error);
        }
    },

    changeMessageStatus: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { messageId } = req.validated!.params!
            const { status } = req.validated!.body!
            const data = await MessageService.changeMessageStatus({ messageId, status });
            return successResponse(res, data, "Message status updated successfully");
        } catch (error) {
            next(error);
        }
    },

    seenBy: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { messageId } = req.validated!.params!
            const data = await MessageService.seenBy({ messageId, userId });
            return successResponse(res, data, "Message seenBy updated successfully");
        } catch (error) {
            next(error);
        }
    },

    markChatAsSeen: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { chatId } = req.validated!.params;
            await MessageService.markChatAsSeen({ chatId, userId });
            return successResponse(res, null, "Chat marked as seen");
        } catch (error) {
            next(error);
        }
    },

    getAllMessages: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await MessageService.getAllChats();
            return successResponse(res, data, "All Messages Retrieved Successfully");
        } catch (error) {
            next(error);
        }
    },
};
