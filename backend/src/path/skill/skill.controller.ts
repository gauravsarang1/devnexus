
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";
import { skillService } from "./skill.service.js";

export const skillController = {
    // ------------------ Create ------------------
    createSkill: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom validated property
            const body = (req as any).validated!.body!;

            const response = await skillService.createSkill(body);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed To Create Skill", 400);
            }

            return successResponse(res, response.data, "Skill Created Successfully", 201);
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // ------------------ Update ------------------
    updateSkill: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom validated property
            const { skillId } = (req as any).validated!.params!;
            const body = (req as any).validated!.body!;

            const response = await skillService.updateSkill(skillId, body);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed To Update Skill", 400);
            }

            return successResponse(res, response.data, "Skill Updated Successfully", 200);
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // ------------------ Delete ------------------
    deleteSkill: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom validated property
            const { skillId } = (req as any).validated!.params!;

            const response = await skillService.deleteSkill(skillId);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed To Delete Skill", 400);
            }

            return successResponse(res, response.data, "Skill Deleted Successfully", 200);
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // ------------------ Get All ------------------
    getAllSkills: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await skillService.getAllSkills();

            if (!response.success) {
                return errorResponse(res, response.error || "Failed To Fetch Skills", 400);
            }

            return successResponse(res, response.data, "Skills Fetched Successfully", 200);
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // ------------------ Get By ID ------------------
    getSkillById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom validated property
            const { skillId } = (req as any).validated!.params!;
            const response = await skillService.getSkillById(skillId);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed To Fetch Skill", 400);
            }

            return successResponse(res, response.data, "Skill Fetched Successfully", 200);
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    }
};