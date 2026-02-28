import { Request, Response, NextFunction } from "express";
import { ProjectService } from "./project.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const projectController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await ProjectService.create(
                req.userId!,
                req.validated!.body!
            );
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

    getBySlug: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { slug } = req.validated!.params!;
            const data = await ProjectService.getBySlug(slug);

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

    getByUserId: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.validated!.params!;
            const query = req.validated!.query!;

            const data = await ProjectService.getByUserId(userId, query);
            return successResponse(res, data, "User projects fetched");
        } catch (e) {
            next(e);
        }
    },

    getAllProjects: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.validated!.query!;
            const data = await ProjectService.getAllProjects(query);

            return successResponse(res, data, "Projects fetched");
        } catch (e) {
            next(e);
        }
    },

    getPersonalizedFeed: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.validated!.query!;
            const data = await ProjectService.getPersonalizedFeed(
                req.userId!,
                query
            );

            return successResponse(res, data, "Personalized projects fetched");
        } catch (e) {
            next(e);
        }
    },

    getTrendingProjects: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.validated!.query!;
            const data = await ProjectService.getTrendingProjects(query);

            return successResponse(res, data, "Trending projects fetched");
        } catch (e) {
            next(e);
        }
    },
};
