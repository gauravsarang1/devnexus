
import prisma from '../../config/prisma.js'
// Service methods return raw data or throw errors; controllers handle HTTP responses
import { BadRequestError } from '../../errors/BadRequestError.js'
import { NotFoundError } from '../../errors/NotFoundError.js'
import { SearchParams } from '../../types/search-params.js'
import {
    CreateReviewDTO,
    ReviewResponse
} from './review.type.js'
import { ReviewTargetType, Review } from '@prisma/client'
import { ReviewNotifier } from './review.notification.js'
import { ReviewHelper } from './review.helper.js'

interface ReviewSearchParams extends SearchParams {
    reviewerId?: string;
    reviewedUserId?: string;
}

export class ReviewService {
    
    static async createReview(data: CreateReviewDTO): Promise<ReviewResponse> {
        const reviewData = ReviewHelper.createReviewData(data);

        const review = await prisma.review.create({
            data: reviewData,
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        uId: true,
                        photo: {
                            where: {
                                type: "AVATAR"
                            }
                        }
                    }
                }
            }
        });

        const formattedReview = {
            ...review,
            reviewer: ReviewHelper.formatReviewer(review.reviewer)
        };
        ReviewNotifier.createReview(formattedReview);

        return formattedReview;
    };

    static async getReviews(params: ReviewSearchParams): Promise<{ reviews: Review[]; pagination: { total: number; page: number; limit: number; pages: number; hasNextPage: boolean } }> {
        const page = params.page ? parseInt(params.page as string, 10) : 1;
        const limit = params.limit ? parseInt(params.limit as string, 10) : 10;
        const skip = (page - 1) * limit;

        const orConditions: any[] = [];
        const { reviewerId, reviewedUserId } = params;

        if (reviewerId) {
            orConditions.push({ reviewerId });
        }

        if (reviewedUserId) {
            orConditions.push({ reviewedUserId });
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: {
                    OR: orConditions.length > 0 ? orConditions : undefined
                },
                skip,
                take: limit,
                include: {
                    reviewer: {
                        select: {
                            name: true,
                            photo: {
                                where: {
                                    type: 'AVATAR'
                                }
                            }
                        }
                    }
                }
            }),
            prisma.review.count({
                where: {
                    OR: orConditions.length > 0 ? orConditions : undefined
                }
            })
        ]);

        const formattedReviews = reviews.map(r => ({
            ...r,
            avatar: r.reviewer.photo[0].url || null
        }))

        return {
            reviews: formattedReviews,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
            }
        };
    };

    static async editReview(reviewId: string, reviewerId: string, data: any): Promise<Review> {
        const existingReview = await prisma.review.findUnique({ where: { id: reviewId } });
        if (!existingReview) throw new NotFoundError("Review not found");
        if (existingReview.reviewerId !== reviewerId) throw new BadRequestError("Unauthorized: you can not update this review");

        const review = await prisma.review.update({
            where: {
                id: reviewId,
                reviewerId
            },
            data
        });

        return review;
    };

    static async deleteReview(reviewId: string, currentUser: string): Promise<null> {
        const existingReview = await prisma.review.findUnique({ where: { id: reviewId } });
        if (!existingReview) throw new NotFoundError("Review not found");
        if (existingReview.reviewerId !== currentUser && existingReview.userId !== currentUser) throw new BadRequestError("Unauthorized: you can not update this review");

        const review = await prisma.review.delete({
            where: {
                id: reviewId
            }
        });

        return null;
    };

    static async getReviewById(reviewId: string): Promise<Review | null> {
        const review = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        });

        return review;
    };

    static async getAllReviews(
        targetId: string,
        targetType: ReviewTargetType,
        currentUserId: string,
        params: SearchParams
    ): Promise<{
        reviews: ReviewResponse[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
            hasNextPage: boolean;
        };
    }> {
        const page = params.page ? parseInt(params.page as string, 10) : 1;
        const limit = params.limit ? parseInt(params.limit as string, 10) : 10;
        const skip = (page - 1) * limit;

        const where = ReviewHelper.buildReviewWhereClause(targetType, targetId);

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    reviewer: {
                        select: {
                            name: true,
                            uId: true,
                            photo: {
                                where: { type: 'AVATAR' },
                            },
                        },
                    },
                },
            }),
            prisma.review.count({ where }),
        ]);

        const formattedReviews: ReviewResponse[] = reviews.map(r => ({
            ...r,
            reviewer: ReviewHelper.formatReviewer(r.reviewer),
        }));

        return {
            reviews: formattedReviews,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
            },
        };
    }

    static async getStats(userId: string, currentUserId: string): Promise<any> {
        const reviews = await prisma.review.findMany({
            where: {
                userId,
            },
            select: {
                rating: true,
            },
        });

        const totalReviews = reviews.length;

        const avgRating =
            totalReviews === 0
                ? 0
                : reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

        return {
            totalReviews,
            avgRating,
        };
    };

    static async getReviewsByReviewedUserId(reviewedUserId: string, params: SearchParams): Promise<{ reviews: Review[]; pagination: { total: number; page: number; limit: number; pages: number; hasNextPage: boolean } }> {
        const page = params.page ? parseInt(params.page as string, 10) : 1;
        const limit = params.limit ? parseInt(params.limit as string, 10) : 10;
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { userId: reviewedUserId },
                skip,
                take: limit,
                include: { reviewer: { select: { name: true, avatar: true } } }
            }),
            prisma.review.count({
                where: { userId: reviewedUserId }
            })
        ]);

        return {
            reviews,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
            }
        };
    };
}
