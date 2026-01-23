
import { Request, Response, NextFunction } from "express";
import { ReviewService } from "./review.service.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";

export const reviewController = {
    
    // CREATE REVIEW
    createReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom userId and validated properties
            const reviewerId = req.userId!;
            const body = req.validated!.body!;

            const data = await ReviewService.createReview(reviewerId, body);
            return successResponse(res, data, "Review created successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            next(error);
        }
    },

    // GET ALL REVIEWS WITH FILTERS
    getReviews: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom validated property
            const query = req.validated!.query!

            const data = await ReviewService.getReviews(query);
            return successResponse(res, data, "Reviews fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            next(error);
        }
    },

    // GET REVIEW BY ID
    getReviewById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom validated property
            const { reviewId } = req.validated!.params!;

            const data = await ReviewService.getReviewById(reviewId);
            return successResponse(res, data, "Review fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            next(error);
        }
    },

    getAllUserReviews: async (req: Request, res: Response, next: NextFunction) => {
        const {userId} = req.validated?.params;
        const query = req.validated!.query;
        const currentUserId = req.userId!;

        const result = await ReviewService.getAllUserReviews(userId, currentUserId, query);
        return successResponse(res, result, "Reviews retrieved successfully");
    },

    getStats: async (req: Request, res: Response, next: NextFunction) => {
        const {userId} = req.validated?.params;
        const currentUserId = req.userId!;

        const result = await ReviewService.getStats(userId, currentUserId);
        return successResponse(res, result, "Stats retrieved successfully"); 
    },

    // EDIT REVIEW
    editReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom userId and validated properties
            const reviewerId = req.userId!;

            const { reviewId } = req.validated!.params!;
            const data = req.validated!.body!;

            const result = await ReviewService.editReview(reviewId,reviewerId, data);
            return successResponse(res, result, "Review updated successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            next(error);
        }
    },

    // DELETE REVIEW
    deleteReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom userId and validated properties
            const currentUser = req.userId!;

            const { reviewId } = req.validated!.params!;

            await ReviewService.deleteReview(reviewId, currentUser);
            return successResponse(res, null, "Review deleted successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            next(error);
        }
    }
};