import { Request, Response, NextFunction } from "express";
import { CommentService } from "./comment.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const commentController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await CommentService.createComment(
                req.userId!,
                req.validated!.body!
            );
            return successResponse(res, result, "Comment added");
        } catch (e) {
            next(e);
        }
    },

    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { postId, projectId } = req.validated!.params!;
            const data = await CommentService.getComments(
                { postId, projectId },
                req.validated!.query!
            );
            return successResponse(res, data, "Comments fetched");
        } catch (e) {
            next(e);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await CommentService.deleteComment(
                req.validated!.params!.commentId,
                req.userId!
            );
            return successResponse(res, null, "Comment deleted");
        } catch (e) {
            next(e);
        }
    },
};
