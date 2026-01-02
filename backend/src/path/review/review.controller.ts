
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

            const response = await ReviewService.createReview(body);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to create review", 500);
            }

            return successResponse(res, response.data, "Review created successfully");
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

            const response = await ReviewService.getReviews(query);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to fetch reviews", 500);
            }

            return successResponse(res, response.data, "Reviews fetched successfully");
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

            const response = await ReviewService.getReviewById(reviewId);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to fetch review", 500);
            }

            return successResponse(res, response.data, "Review fetched successfully");
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

            const response = await ReviewService.getReviewsByReviewerId(reviewerId, query);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to fetch reviewer reviews", 500);
            }

            return successResponse(res, response.data, "Reviews fetched successfully");
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

            const response = await ReviewService.getReviewsByReviewedUserId(reviewedUserId, query);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to fetch user reviews", 500);
            }

            return successResponse(res, response.data, "Reviews fetched successfully");
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

            const response = await ReviewService.editReview(reviewId,reviewerId, data);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to edit review", 500);
            }

            return successResponse(res, response.data, "Review updated successfully");
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

            const response = await ReviewService.deleteReview(reviewId, currentUser);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to delete review", 500);
            }

            return successResponse(res, null, "Review deleted successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    }
};