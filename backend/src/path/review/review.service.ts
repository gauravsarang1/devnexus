
import prisma from '../../config/prisma.js'
import { ServiceResponse } from '../../types/serviceResponse.js'
import { SearchParams } from '../../types/search-params.js'
import { NotificationService } from '../notification/notification.service.js'
import io from '../../sockets/socketHandlers.js'

export interface CreateReviewDTO {
    reviewerId: string, reviewedUserId: string, comment?: string, rating: number
};

interface ReviewSearchParams extends SearchParams {
    reviewerId?: string;
    reviewedUserId?: string;
}

export type EditReviewDTO = Partial<Pick<CreateReviewDTO, 'comment' | 'rating'>>

export class ReviewService {
    static async createReview(data: CreateReviewDTO): Promise<ServiceResponse> {
        const review = await prisma.review.create({
            data,
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

        return {
            success: true,
            data: review
        }
    };

    static async getReviews(params: ReviewSearchParams): Promise<ServiceResponse> {
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
                include: { reviewer: { select: { name: true, avatar: true } } }
            }),
            prisma.review.count({
                where: {
                    OR: orConditions.length > 0 ? orConditions : undefined
                }
            })
        ]);

        return {
            success: true,
            data: {
                reviews,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                }
            }
        };
    };

    static async editReview(reviewId: string, reviewerId: string, data: EditReviewDTO): Promise<ServiceResponse> {
        const existingReview = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        });

        if (existingReview?.reviewerId !== reviewerId) return {
            success: false,
            error: "Unauthorized: you can not update this review"
        };

        const review = await prisma.review.update({
            where: {
                id: reviewId,
                reviewerId
            },
            data
        });

        return {
            success: true,
            data: review
        }
    };

    static async deleteReview(reviewId: string, currentUser: string): Promise<ServiceResponse> {
        const existingReview = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        });

        if (existingReview?.reviewerId !== currentUser && existingReview?.reviewedUserId !== currentUser) return {
            success: false,
            error: "Unauthorized: you can not update this review"
        };

        const review = await prisma.review.delete({
            where: {
                id: reviewId
            }
        });

        return {
            success: true,
            data: review
        }
    };

    static async getReviewById(reviewId: string): Promise<ServiceResponse> {
        const review = await prisma.review.findUnique({
            where: {
                id:reviewId
            }
        });

        return {
            success: true,
            data: review
        }
    };

    static async getReviewsByReviewerId(reviewerId: string, params: SearchParams): Promise<ServiceResponse> {
        const page = params.page ? parseInt(params.page as string, 10) : 1;
        const limit = params.limit ? parseInt(params.limit as string, 10) : 10;
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { reviewerId },
                skip,
                take: limit,
                include: { reviewedUser: { select: { name: true, avatar: true } } }
            }),
            prisma.review.count({
                where: { reviewerId }
            })
        ]);

        return {
            success: true,
            data: {
                reviews,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                }
            }
        };
    };

    static async getReviewsByReviewedUserId(reviewedUserId: string, params: SearchParams): Promise<ServiceResponse> {
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
            success: true,
            data: {
                reviews,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                }
            }
        };
    };
}
