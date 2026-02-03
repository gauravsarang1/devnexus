import { Request, Response, NextFunction } from "express";
import { ProjectService } from "./project.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const projectController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await ProjectService.create(req.userId!, req.validated!.body!);
            return successResponse(res, data, "Project created");
        } catch (e) {
            next(e);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await ProjectService.update(
                req.validated!.params!.projectId,
                req.userId!,
                req.validated!.body!
            );
            return successResponse(res, data, "Project updated");
        } catch (e) {
            next(e);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await ProjectService.getById(
                req.validated!.params!.projectId
            );
            return successResponse(res, data, "Project fetched");
        } catch (e) {
            next(e);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await ProjectService.delete(
                req.validated!.params!.projectId,
                req.userId!
            );
            return successResponse(res, null, "Project deleted");
        } catch (e) {
            next(e);
        }
    },
};
