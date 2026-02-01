import { ReviewResponse } from "./review.type.js";
import prisma from "../../config/prisma.js";
import { NotificationService } from "../notification/notification.service.js";
import io from "../../sockets/socketHandlers.js";
import { NotificationType } from "@prisma/client";

export class ReviewNotifier {
    private static buildNotification(review: ReviewResponse) {
        return {
            type: NotificationType.REVIEW,
            title: 'New Skill Endorsement!',
            message: `${review.reviewer.name} left you a ${review.rating}-star review.`,
            link: `/profile`,
            payload: { reviewId: review.id },
        };
    }

    private static async resolveTargetUserId(
        review: ReviewResponse
    ): Promise<string | null> {
        if (review.targetType === 'POST') {
            const post = await prisma.post.findUnique({
                where: { id: review.postId! },
                select: { userId: true },
            });
            return post?.userId ?? null;
        }

        if (review.targetType === 'PROJECT') {
            const project = await prisma.project.findUnique({
                where: { id: review.projectId! },
                select: { userId: true },
            });
            return project?.userId ?? null;
        }

        return review.userId ?? null;
    }

    static async createReview(review: ReviewResponse) {
        const userId = await this.resolveTargetUserId(review);
        if (!userId) return;

        const notification = this.buildNotification(review);

        NotificationService.createNotification({
            userId,
            ...notification,
        }).catch(console.error);

        io.to(`user:${userId}`).emit('notification', notification);
    }
}
