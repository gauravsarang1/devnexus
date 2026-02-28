
import { SkillOnUser } from "./skill-on-user.service.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";

export const skillOnUser = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const body = req.validated!.body!;
            const data = await SkillOnUser.createSkillOnUser({ ...body, userId });
            return successResponse(res, data, "Skill added to user successfully", 201);
        } catch (error) {
            next(error);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skillOnUserId } = req.validated!.params!;
            const currentUserId = req.userId!; 
            const body = req.validated!.body!;

            const data = await SkillOnUser.updateSkillOnUser(skillOnUserId, currentUserId, body);
            return successResponse(res, data, "Skill updated successfully");
        } catch (error) {
            next(error);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skillOnUserId } = req.validated!.params!;
            const currentUserId = req.userId!;
            const data = await SkillOnUser.deleteSkillOnUser(skillOnUserId, currentUserId);
            return successResponse(res, data, "Skill deleted successfully");
        } catch (error) {
            next(error);
        }
    },

    getMatching: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUserId = req.userId!;
            const { otherUserId } = req.validated!.params!;
            
            const data = await SkillOnUser.getMatchingSkills({ currentUserId, otherUserId });
            return successResponse(res, data, "Matched skills discovered");
        } catch (error) { 
            // Cast next to any to resolve "no call signatures" error
            next(error); 
        }
    },

    getOne: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skillOnUserId } = req.validated!.params!;
            const data = await SkillOnUser.getSkillOnUserById(skillOnUserId);
            return successResponse(res, data, "Skill fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            next(error);
        }
    },

    getAllByUser: async (req: Request, res: Response, next:NextFunction) => {
        try {
            const { userId } = req.validated!.params!;
            const data = await SkillOnUser.getSkillsOnUserByUserId(userId);
            return successResponse(res, data, "User skills fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            next(error)
        }
    },

    getAll: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await SkillOnUser.getAllSkillOnUsers();
            return successResponse(res, data, "All skills fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            next(error);
        }
    }
};