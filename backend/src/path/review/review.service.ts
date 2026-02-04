
import prisma from '../../config/prisma.js'
// Service methods return raw data or throw errors; controllers handle HTTP responses
import { BadRequestError } from '../../errors/BadRequestError.js'
import { NotFoundError } from '../../errors/NotFoundError.js'
import { SearchParams } from '../../types/search-params.js'
import {
    CreateReviewDTO,
    ReviewResponse
} from './review.type.js'
import { Review } from '@prisma/client'
import { ReviewNotifier } from './review.notification.js'
import { ReviewHelper } from './review.helper.js'

interface ReviewSearchParams extends SearchParams {
    reviewerId?: string;
    reviewedUserId?: string;
}

export class ReviewService {
    static async createReview(data: CreateReviewDTO): Promise<ReviewResponse> {
        if (!!data.userId === !!data.projectId) {
            throw new BadRequestError("Review must target either a user or a project");
        }

        const existingReview = await prisma.review.findFirst({
            where: {
                reviewerId: data.reviewerId,
                ...(data.userId && { userId: data.userId }),
                ...(data.projectId && { projectId: data.projectId }),
            },
        });

        if (existingReview) {
            throw new BadRequestError("You have already reviewed this entity");
        }

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
                            where: { type: "AVATAR" },
                            take: 1,
                        },
                    },
                },
            },
        });

        const formattedReview: ReviewResponse = {
            ...review,
            reviewer: ReviewHelper.formatReviewer(review.reviewer),
        };

        ReviewNotifier.createReview(formattedReview);

        return formattedReview;
    }

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
            orConditions.push({ uerId: reviewedUserId });
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
        if (existingReview.reviewerId !== currentUser) throw new BadRequestError("Unauthorized: you can not update this review");

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
        userId: string | null,
        projectId: string | null,
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
        if (!!userId === !!projectId) {
            throw new Error("Provide either userId or projectId, not both");
        }

        const page = params.page ? parseInt(params.page as string, 10) : 1;
        const limit = params.limit ? parseInt(params.limit as string, 10) : 10;
        const skip = (page - 1) * limit;

        const where = ReviewHelper.buildReviewWhereClause({
            ...(userId && { userId }),
            ...(projectId && { projectId }),
        });

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    reviewer: {
                        select: {
                            name: true,
                            uId: true,
                            photo: {
                                where: { type: "AVATAR" },
                                take: 1,
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
        const result = await prisma.review.aggregate({
            where: { userId },
            _count: true,
            _avg: { rating: true },
        });

        return {
            totalReviews: result._count,
            avgRating: result._avg.rating,
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
