
import { MatchService } from "./match.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";

export const matchController = {
    getMatchById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { matchId } = req.validated!.params!;
            const data = await MatchService.getMatchById(matchId);
            return successResponse(res, data, "Match retrieved successfully", 200);
        } catch (error) { 
            next(error); 
        }   
    },

    getAllMatches: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const {type} = req.validated!.query;
            const data = await MatchService.getAllMatches(userId, type, req.validated!.query);
            return successResponse(res, data, "Matches retrieved successfully", 200);
        } catch (error) { 
            next(error); 
        }
    },

    updateStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { matchId } = req.validated!.params!;
            const { status } = req.validated!.body!;
            const data = await MatchService.updateMatchStatus(userId, matchId, status);
            return successResponse(res, data, `Request ${status.toLowerCase()} successfully`);
        } catch (error) { 
            next(error); 
        }
    },

    createMatch: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const senderId = req.userId!;
            const { targetUserId } = req.validated!.body!;
            const data = await MatchService.sendMatchRequest(senderId, targetUserId);
            return successResponse(res, data, "Match created successfully", 201);
        } catch (error) { 
            next(error); 
        }   
    }
}
