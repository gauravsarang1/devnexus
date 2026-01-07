
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";
import { ChatService } from "./chat.service.js";

export const chatController = {
    createChat: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { participantsIds } = req.validated!.body;
            const userId = req.userId!;
            const participants: string[] = Array.from(new Set([userId, ...participantsIds]));
            const response = await ChatService.createChat({ participants });
            if (!response.success) return errorResponse(res, response.error || "Failed to create chat", 500);
            return successResponse(res, response.data, "Chat created successfully", 201);
        } catch (error) { 
            next(error); 
        }
    },

    getChatById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const userId = req.userId!;
            const response = await ChatService.getChatById(id, userId);
            if (!response.success) return errorResponse(res, response.error || "Chat not found", 404);
            return successResponse(res, response.data, "Chat retrieved successfully");
        } catch (error) { 
            (next as any)(error); 
        }
    },

    getAllChats: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const response = await ChatService.getAllChats(userId, (req as any).query);
            if (!response.success) return errorResponse(res, response.error || "Failed to retrieve chats", 500);
            return successResponse(res, response.data, "Chats retrieved successfully");
        } catch (error) { 
            (next as any)(error); 
        }
    },

    deleteChat: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { id } = (req as any).params;
            const response = await ChatService.deleteChat({ chatId: id, userId });
            if (!response.success) return errorResponse(res, response.error || "Chat not found", 404);
            return successResponse(res, response.data, "Chat deleted successfully");
        } catch (error) { 
            (next as any)(error); 
        }
    },

    addParticipant: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { chatId, userId } = (req as any).validated!.body;
            const response = await ChatService.addParticipant({ chatId, userId });
            if (!response.success) return errorResponse(res, response.error || "Failed to add participant", 500);
            return successResponse(res, response.data, "Participant added successfully");
        } catch (error) { 
            (next as any)(error); 
        }
    },

    removeParticipant: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { chatId, userId } = (req as any).validated!.body;
            const response = await ChatService.removeParticipant({ chatId, userId });
            if (!response.success) return errorResponse(res, response.error || "Failed to remove participant", 500);
            return successResponse(res, response.data, "Participant removed successfully");
        } catch (error) { 
            (next as any)(error); 
        }
    }
};
