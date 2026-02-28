import { Request, Response, NextFunction } from "express";
import { LikeService } from "./like.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const likeController = {
    toggleLike: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.userId!;
            const body = req.validated!.body!;

            const result = await LikeService.toggleLike(
                userId,
                body
            );

            return successResponse(
                res,
                result,
                "Like updated successfully"
            );
        } catch (error) {
            next(error);
        }
    },

    getAll: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const query = req.validated!.query!;

            const data = await LikeService.getAll({
                postId: query.postId,
                projectId: query.projectId,
                reviewId: query.reviewId,
                page: query.page ? Number(query.page) : undefined,
                limit: query.limit ? Number(query.limit) : undefined
            });

            return successResponse(
                res,
                data,
                "Likes fetched successfully"
            );
        } catch (error) {
            next(error);
        }
    }
};
