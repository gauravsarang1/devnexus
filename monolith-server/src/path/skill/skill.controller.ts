
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";
import { skillService } from "./skill.service.js";

export const skillController = {
    createSkill: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.validated!.body!;
            const data = await skillService.createSkill(body);
            return successResponse(res, data, "Skill Created Successfully", 201);
        } catch (error) {
            next(error);
        }
    },

    updateSkill: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skillId } = req.validated!.params!;
            const body = req.validated!.body!;
            const data = await skillService.updateSkill(skillId, body);
            return successResponse(res, data, "Skill Updated Successfully", 200);
        } catch (error) {
            next(error);
        }
    },

    deleteSkill: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skillId } = req.validated!.params!;
            const data = await skillService.deleteSkill(skillId);
            return successResponse(res, data, "Skill Deleted Successfully", 200);
        } catch (error) {
            next(error);
        }
    },

    getAllSkills: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await skillService.getAllSkills();
            return successResponse(res, data, "Skills Fetched Successfully", 200);
        } catch (error) {
            next(error);
        }
    },

    getSkillById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skillId } = req.validated!.params!;
            const data = await skillService.getSkillById(skillId);
            return successResponse(res, data, "Skill Fetched Successfully", 200);
        } catch (error) {
            next(error);
        }
    }
};