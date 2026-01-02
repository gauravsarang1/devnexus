
import { successResponse, errorResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";
import { MessageService } from "./message.service.js";

export const messageController = {
    sendMessage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const senderId = (req as any).userId!;
            const  { chatId, text }  = (req as any).validated!.body!

            const response = await MessageService.sendMessage({
                chatId,
                text,
                senderId,
            });

            if (!response.success) {
                return errorResponse(
                    res,
                    response.error || "Failed to send message",
                    500
                );
            }
            
            return successResponse(
                res,
                response.data,
                "Message sent successfully",
                201
            );
        } catch (error) {
            (next as any)(error);
        }
    },

    getMessagesByChatId: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { chatId } = (req as any).validated!.params!
            const { page, limit } = (req as any).query;

            const response = await MessageService.getMessagesByChatId({
                chatId, 
                page: page ? parseInt(page) : undefined, 
                limit: limit ? parseInt(limit) : undefined
            });

            if (!response.success) {
                return errorResponse(
                    res,
                    response.error || "Failed to retrieve messages",
                    500
                );
            }

            return successResponse(
                res,
                response.data,
                "Messages retrieved successfully"
            );
        } catch (error) {
            (next as any)(error);
        }
    },

    deleteMessage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { messageId } = (req as any).validated!.params!
        
            const response = await MessageService.deleteMessage({
                messageId,
                userId
            });

            if (!response.success) {
                return errorResponse(res, response.error || "Message not found", 404);
            }

            return successResponse(
                res,
                response.data,
                "Message deleted successfully"
            );
        } catch (error) {
            (next as any)(error);
        }
    },

    editMessage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { messageId } = (req as any).validated!.params!
            const { newText } = (req as any).validated!.body!

            const response = await MessageService.editMessage({
                messageId,
                newText,
                userId
            });

            if (!response.success) {
                return errorResponse(res, response.error || "Message not found", 404);
            }

            return successResponse(res, response.data, "Message edited successfully");
        } catch (error) {
            (next as any)(error);
        }
    },

    changeMessageStatus: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { messageId } = (req as any).validated!.params!
            const { status } = (req as any).validated!.body!

            const response = await MessageService.changeMessageStatus({
                messageId,
                status
            });

            if (!response.success) {
                return errorResponse(res, response.error || "Message not found", 404);
            }

            return successResponse(
                res,
                response.data,
                "Message status updated successfully"
            );
        } catch (error) {
            (next as any)(error);
        }
    },

    seenBy: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { messageId } = (req as any).validated!.params!

            const response = await MessageService.seenBy({
                messageId,
                userId
            });
            
            if (!response.success) {
                return errorResponse(res, response.error || "Message not found", 404);
            }

            return successResponse(
                res,
                response.data,
                "Message seenBy updated successfully"
            );
        } catch (error) {
            (next as any)(error);
        }
    },

    markChatAsSeen: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { chatId } = (req as any).params;

            const response = await MessageService.markChatAsSeen({
                chatId,
                userId
            });

            if (!response.success) {
                return errorResponse(res, response.error || "Update failed", 500);
            }

            return successResponse(res, null, "Chat marked as seen");
        } catch (error) {
            (next as any)(error);
        }
    },

    getAllMessages: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await MessageService.getAllChats();

            if (!response.success) {
                return errorResponse(res, response.error || "Messages not found", 404);
            }

            return successResponse(
                res,
                response.data,
                "All Messages Retrieved Successfully"
            );
        } catch (error) {
            (next as any)(error);
        }
    },
};
