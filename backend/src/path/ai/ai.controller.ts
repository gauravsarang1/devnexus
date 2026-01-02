import { Request, Response, NextFunction } from "express";
import { AIService } from "./ai.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const aiController = {
  suggestSearch: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = (req as any).body;
      if (!query || query.length < 2) return successResponse(res, [], "Query too short");
      const suggestions = await AIService.suggestSearchTerms(query);
      return successResponse(res, suggestions, "AI Search suggestions generated");
    } catch (error) { next(error); }
  },

  suggestUids: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { input } = (req as any).body;
      if (!input) return errorResponse(res, "Input is required", 400);
      const suggestions = await AIService.suggestUids(input);
      return successResponse(res, suggestions, "UID suggestions generated");
    } catch (error) { next(error); }
  },

  refineBio: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, bio } = (req as any).body;
      if (!bio) return errorResponse(res, "Bio is required", 400);
      const refined = await AIService.refineBio(name || "User", bio);
      return successResponse(res, { refined }, "Bio refined successfully");
    } catch (error) { next(error); }
  },

  refineMessage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text } = (req as any).body;
      if (!text) return errorResponse(res, "Text is required", 400);
      const refined = await AIService.refineMessage(text);
      return successResponse(res, { refined }, "Message refined successfully");
    } catch (error) { next(error); }
  },

  askAssistant: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question } = (req as any).body;
      if (!question) return errorResponse(res, "Question is required", 400);
      const answer = await AIService.askAssistant(question);
      return successResponse(res, { answer }, "Assistant replied");
    } catch (error) { next(error); }
  },

  coachChat: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { messages } = (req as any).body;
      if (!messages || !Array.isArray(messages)) return errorResponse(res, "Messages history is required", 400);
      
      const answer = await AIService.coachChat(userId, messages);
      return successResponse(res, { answer }, "Coach replied");
    } catch (error) { next(error); }
  }
};