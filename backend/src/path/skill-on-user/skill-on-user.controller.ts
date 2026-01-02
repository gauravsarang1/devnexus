
import { SkillOnUser } from "./skill-on-user.service.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";

export const skillOnUser = {

    // -------------------------------------------------
    // CREATE SKILL ON USER
    // -------------------------------------------------
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const body = (req as any).validated!.body!;

            const response = await SkillOnUser.createSkillOnUser({ ...body, userId });

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to create", 400);
            }

            return successResponse(res, response.data, "Skill added to user successfully", 201);
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // -------------------------------------------------
    // UPDATE SKILL ON USER (Only owner)
    // -------------------------------------------------
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skillOnUserId } = (req as any).validated!.params!;
            const currentUserId = (req as any).userId!; 
            const body = (req as any).validated!.body!;

            const response = await SkillOnUser.updateSkillOnUser(skillOnUserId, currentUserId, body);

            if (!response.success) {
                return errorResponse(res, response.error || "Access denied", 403);
            }

            return successResponse(res, response.data, "Skill updated successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // -------------------------------------------------
    // DELETE SKILL ON USER (Only owner)
    // -------------------------------------------------
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skillOnUserId } = (req as any).validated!.params!;
            const currentUserId = (req as any).userId!;

            const response = await SkillOnUser.deleteSkillOnUser(skillOnUserId, currentUserId);

            if (!response.success) {
                return errorResponse(res, response.error || "Access denied", 403);
            }

            return successResponse(res, response.data, "Skill deleted successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // -------------------------------------------------
    // MATCHING SKILLS DISCOVERY
    // -------------------------------------------------
    getMatching: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUserId = (req as any).userId!;
            const { otherUserId } = (req as any).params;
            
            const response = await SkillOnUser.getMatchingSkills({ currentUserId, otherUserId });
            if (!response.success) return errorResponse(res, response.error || "Discovery failed", 400);
            
            return successResponse(res, response.data, "Matched skills discovered");
        } catch (error) { 
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error); 
        }
    },

    getOne: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skillOnUserId } = (req as any).validated!.params!;
            const response = await SkillOnUser.getSkillOnUserById(skillOnUserId);

            if (!response.success) {
                return errorResponse(res, response.error || "Not found", 404);
            }

            return successResponse(res, response.data, "Skill fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    getAllByUser: async (req: Request, res: Response, next:NextFunction) => {
        try {
            const { userId } = (req as any).validated!.params!;
            const response = await SkillOnUser.getSkillsOnUserByUserId(userId);
            
            if (!response.success) {
                return errorResponse(res, response.error || "Failed to fetch user skills", 404);
            }

            return successResponse(res, response.data, "User skills fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error)
        }
    },

    getAll: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await SkillOnUser.getAllSkillOnUsers();

            if (!response.success) {
                return errorResponse(res, response.error || "Internal error", 500);
            }

            return successResponse(res, response.data, "All skills fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    }
};