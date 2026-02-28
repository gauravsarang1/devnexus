import { Request, Response, NextFunction } from "express";
import { AIService } from "./ai.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const aiController = {
  suggestSearch: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.validated!.body;
      const data = await AIService.suggestSearchTerms(query);
      return successResponse(res, data, "AI Search suggestions generated");
    } catch (error) { next(error); }
  },

  suggestUids: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { input } = req.validated!.body;
      const data = await AIService.suggestUids(input);
      return successResponse(res, data, "UID suggestions generated");
    } catch (error) { next(error); }
  },

  refineBio: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, bio } = req.validated!.body;
      const refined = await AIService.refineBio(name || "User", bio);
      return successResponse(res, { refined }, "Bio refined successfully");
    } catch (error) { next(error); }
  },

  refineMessage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text } = req.validated!.body;
      const refined = await AIService.refineMessage(text);
      return successResponse(res, { refined }, "Message refined successfully");
    } catch (error) { next(error); }
  },

  askAssistant: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question } = req.validated!.body;
      const answer = await AIService.askAssistant(question);
      return successResponse(res, { answer }, "Assistant replied");
    } catch (error) { next(error); }
  },

  coachChat: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { messages } = req.validated!.body;
      const answer = await AIService.coachChat(userId, messages);
      return successResponse(res, { answer }, "Coach replied");
    } catch (error) { next(error); }
  }
};