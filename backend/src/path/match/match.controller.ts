
import { MatchService } from "./match.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";

export const matchController = {
    getMatchById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { matchId } = (req as any).validated!.params!;
            const response = await MatchService.getMatchById(matchId);
            if (!response.success) return errorResponse(res, response.error || "Failed to retrieve match", 400);
            return successResponse(res, response.data, "Match retrieved successfully", 200);
        } catch (error) { 
            (next as any)(error); 
        }   
    },

    getAllMatches: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const type = (req as any).query?.type as string;
            const response = await MatchService.getAllMatches(userId, type, (req as any).query);
            if (!response.success) return errorResponse(res, response.error || "Failed to retrieve matches", 400);
            return successResponse(res, response.data, "Matches retrieved successfully", 200);
        } catch (error) { 
            (next as any)(error); 
        }
    },

    updateStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { matchId } = (req as any).validated!.params!;
            const { status } = (req as any).validated!.body!;
            const response = await MatchService.updateMatchStatus(userId, matchId, status);
            if (!response.success) return errorResponse(res, response.error || "Update failed", 400);
            return successResponse(res, response.data, `Request ${status.toLowerCase()} successfully`);
        } catch (error) { 
            (next as any)(error); 
        }
    },

    createMatch: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const senderId = (req as any).userId!;
            const { targetUserId } = (req as any).validated!.body!;
            const response = await MatchService.sendMatchRequest(senderId, targetUserId);
            if (!response.success) return errorResponse(res, response.error || "Failed to create match", 400);
            return successResponse(res, response.data, "Match created successfully", 201);
        } catch (error) { 
            (next as any)(error); 
        }   
    }
}
