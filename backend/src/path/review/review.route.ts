import { reviewController } from "./review.controller.js";
import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { ReviewValidation } from '../../validation/review/review.validation.js';
import { requireAuth } from "../../middleware/auth.middleware.js";

export const reviewRouter = Router();

reviewRouter.post('/', requireAuth, validate(ReviewValidation.createReview), reviewController.createReview);
reviewRouter.get('/', validate(ReviewValidation.getReviews), reviewController.getReviews)
reviewRouter.get('/:reviewId', validate(ReviewValidation.reviewById), reviewController.getReviewById);
reviewRouter.put('/:reviewId', requireAuth, validate(ReviewValidation.editReview), reviewController.editReview);
reviewRouter.delete('/:reviewId', requireAuth, validate(ReviewValidation.deleteReview), reviewController.deleteReview);

reviewRouter.get('/reviewer/:reviewerId', validate(ReviewValidation.reviewsByReviewerId), reviewController.getReviewsByReviewerId);
reviewRouter.get('/reviewedUser/:reviewedUserId', validate(ReviewValidation.reviewsByReviewedUserId), reviewController.getReviewsByReviewedUserId);

export default reviewRouter
