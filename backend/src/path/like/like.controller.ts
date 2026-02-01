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
    }
};
