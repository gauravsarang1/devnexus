
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";
import { ChatService } from "./chat.service.js";

export const chatController = {
    createChat: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { participantsIds } = req.validated!.body;
            const userId = req.userId!;
            const participants: string[] = Array.from(new Set([userId, ...participantsIds]));
            const data = await ChatService.createChat({ participants });
            return successResponse(res, data, "Chat created successfully", 201);
        } catch (error) { 
            next(error); 
        }
    },

    getChatById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.validated!.params;
            const userId = req.userId!;
            const data = await ChatService.getChatById(id, userId);
            return successResponse(res, data, "Chat retrieved successfully");
        } catch (error) { 
            next(error); 
        }
    },

    getAllChats: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const query = req.validated!.query!;
            const data = await ChatService.getAllChats(userId, query);
            return successResponse(res, data, "Chats retrieved successfully");
        } catch (error) { 
            next(error); 
        }
    },

    deleteChat: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { id } = req.validated!.params;
            const data = await ChatService.deleteChat({ chatId: id, userId });
            return successResponse(res, data, "Chat deleted successfully");
        } catch (error) { 
            next(error); 
        }
    },
};
