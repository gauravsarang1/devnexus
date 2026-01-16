
import { Request, Response, NextFunction } from "express";
import { ReviewService } from "./review.service.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";

export const reviewController = {
    
    // CREATE REVIEW
    createReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom userId and validated properties
            const reviewerId = (req as any).userId!;
            const body = (req as any).validated!.body!;

            const data = await ReviewService.createReview(body);
            return successResponse(res, data, "Review created successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // GET ALL REVIEWS WITH FILTERS
    getReviews: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom validated property
            const query = (req as any).validated!.query!

            const data = await ReviewService.getReviews(query);
            return successResponse(res, data, "Reviews fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // GET REVIEW BY ID
    getReviewById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom validated property
            const { reviewId } = (req as any).validated!.params!;

            const data = await ReviewService.getReviewById(reviewId);
            return successResponse(res, data, "Review fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // GET REVIEWS BY REVIEWER ID
    getReviewsByReviewerId: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom validated property
            const { reviewerId } = (req as any).validated!.params!;
            const query = (req as any).validated!.query!;

            const data = await ReviewService.getReviewsByReviewerId(reviewerId, query);
            return successResponse(res, data, "Reviews fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // GET REVIEWS BY REVIEWED USER ID
    getReviewsByReviewedUserId: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access standard params and custom validated properties
            const { reviewedUserId } = (req as any).params;
            const query = (req as any).validated!.query!;

            const data = await ReviewService.getReviewsByReviewedUserId(reviewedUserId, query);
            return successResponse(res, data, "Reviews fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // EDIT REVIEW
    editReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom userId and validated properties
            const reviewerId = (req as any).userId!;

            const { reviewId } = (req as any).validated!.params!;
            const data = (req as any).validated!.body!;

            const result = await ReviewService.editReview(reviewId,reviewerId, data);
            return successResponse(res, result, "Review updated successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // DELETE REVIEW
    deleteReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom userId and validated properties
            const currentUser = (req as any).userId!;

            const { reviewId } = (req as any).validated!.params!;

            await ReviewService.deleteReview(reviewId, currentUser);
            return successResponse(res, null, "Review deleted successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    }
};