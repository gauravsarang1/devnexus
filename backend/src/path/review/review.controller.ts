
import { Request, Response, NextFunction } from "express";
import { ReviewService } from "./review.service.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";

export const reviewController = {
    
    createReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reviewerId = req.userId!;
            const body = req.validated!.body!;

            const data = await ReviewService.createReview({
                ...body,
                reviewerId
            });
            return successResponse(res, data, "Review created successfully");
        } catch (error) {
            next(error);
        }
    },

    getReviews: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.validated!.query!

            const data = await ReviewService.getReviews(query);
            return successResponse(res, data, "Reviews fetched successfully");
        } catch (error) {
            next(error);
        }
    },

    getReviewById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { reviewId } = req.validated!.params!;

            const data = await ReviewService.getReviewById(reviewId);
            return successResponse(res, data, "Review fetched successfully");
        } catch (error) {
            next(error);
        }
    },

    getAllReviews: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {targetId, targetType } = req.validated?.params;
            const query = req.validated?.query;
            const currentUserId = req.userId!;
    
            const result = await ReviewService.getAllReviews(targetId, targetType, currentUserId, query);
            return successResponse(res, result, "Reviews retrieved successfully");
        } catch (error) {
            next(error)
        }
    },

    getStats: async (req: Request, res: Response, next: NextFunction) => {
        const {userId} = req.validated?.params;
        const currentUserId = req.userId!;

        const result = await ReviewService.getStats(userId, currentUserId);
        return successResponse(res, result, "Stats retrieved successfully"); 
    },

    editReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reviewerId = req.userId!;

            const { reviewId } = req.validated?.params;
            const data = req.validated!.body!;

            const result = await ReviewService.editReview(reviewId,reviewerId, data);
            return successResponse(res, result, "Review updated successfully");
        } catch (error) {
            next(error);
        }
    },

    deleteReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUser = req.userId!;

            const { reviewId } = req.validated!.params!;

            await ReviewService.deleteReview(reviewId, currentUser);
            return successResponse(res, null, "Review deleted successfully");
        } catch (error) {
            next(error);
        }
    }
};