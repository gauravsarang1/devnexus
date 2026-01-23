
import prisma from '../../config/prisma.js'
// Service methods return raw data or throw errors; controllers handle HTTP responses
import { BadRequestError } from '../../errors/BadRequestError.js'
import { NotFoundError } from '../../errors/NotFoundError.js'
import { SearchParams } from '../../types/search-params.js'
import { NotificationService } from '../notification/notification.service.js'
import io from '../../sockets/socketHandlers.js'
import {
    CreateReviewDTO,
    ReviewResponse,
    UserReviewsResponse,
    Review
} from '../../types/service.types.js'

interface ReviewSearchParams extends SearchParams {
    reviewerId?: string;
    reviewedUserId?: string;
}

export class ReviewService {
    static async createReview(reviewerId: string, data: CreateReviewDTO): Promise<ReviewResponse> {
        const review = await prisma.review.create({
            data: {
                reviewerId: reviewerId,
                reviewedUserId: data.reviewedUserId,
                rating: data.rating,
                comment: data.comment
            },
            include: { reviewer: { select: { name: true } } }
        });

        // Persistent Notification
        await NotificationService.createNotification({
            userId: data.reviewedUserId,
            type: 'REVIEW' as any,
            title: 'New Skill Endorsement!',
            message: `${review.reviewer.name} left you a ${data.rating}-star review.`,
            link: `/profile`,
            payload: { reviewId: review.id }
        });

        // Real-time Emit
        io.to(`user:${data.reviewedUserId}`).emit('notification', {
            type: 'REVIEW' as any,
            title: 'New Skill Endorsement!',
            message: `${review.reviewer.name} left you a ${data.rating}-star review.`,
            link: `/profile`
        });

        return review;
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
        if (existingReview.reviewerId !== currentUser && existingReview.reviewedUserId !== currentUser) throw new BadRequestError("Unauthorized: you can not update this review");

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

    static async getAllUserReviews(userId: string, currentUserId: string, params: SearchParams): Promise<{ reviews: ReviewResponse[]; pagination: { total: number; page: number; limit: number; pages: number; hasNextPage: boolean } }> {
        const page = params.page ? parseInt(params.page as string, 10) : 1;
        const limit = params.limit ? parseInt(params.limit as string, 10) : 10;
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { reviewedUserId: userId },
                skip,
                take: limit,
                include: {
                    reviewer: {
                        select: {
                            name: true,
                            photo: {
                                where: {
                                    type: "AVATAR"
                                }
                            },
                            uId: true
                        }
                    }
                }
            }),
            prisma.review.count({
                where: { reviewedUserId: userId }
            }),
        ]);

        const formattedReviews: ReviewResponse[] = reviews.map(r => {
            const { reviewer, ...rest } = r;

            return {
                ...rest,
                reviewer: {
                    uId: reviewer.uId,
                    name: reviewer.name,
                    avatar: reviewer.photo?.[0]?.url ?? null,
                },
            };
        });


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

    static async getStats(userId: string, currentUserId: string): Promise<any> {
        const reviews = await prisma.review.findMany({
            where: {
                reviewedUserId: userId,
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
                where: { reviewedUserId },
                skip,
                take: limit,
                include: { reviewer: { select: { name: true, avatar: true } } }
            }),
            prisma.review.count({
                where: { reviewedUserId }
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
