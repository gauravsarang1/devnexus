import prisma from "../../config/prisma.js";
import io from "../../sockets/socketHandlers.js";
import { NotificationService } from "../notification/notification.service.js";
import { Like, NotificationType } from "@prisma/client";

export class LikeNotifier {
    private static async resolveTargetUserId(like: Like) {
        if (like.postId) {
            const post = await prisma.post.findUnique({
                where: { id: like.postId },
                select: { authorId: true }
            });
            return post?.authorId;
        }

        if (like.projectId) {
            const project = await prisma.project.findUnique({
                where: { id: like.projectId },
                select: { userId: true }
            });
            return project?.userId;
        }

        if (like.reviewId) {
            const review = await prisma.review.findUnique({
                where: { id: like.reviewId },
                select: { reviewerId: true }
            });
            return review?.reviewerId;
        }

        return null;
    }

    static async onLikeCreated(like: Like) {
        const targetUserId = await this.resolveTargetUserId(like);
        if (!targetUserId || targetUserId === like.userId) return;

        const notification = {
            type: NotificationType.SYSTEM,
            title: "New Like",
            message: "Someone liked your content",
            link: "/",
            payload: {
                likeId: like.id
            }
        };

        NotificationService.createNotification({
            userId: targetUserId,
            ...notification
        }).catch(console.error);

        io.to(`user:${targetUserId}`).emit("notification", notification);
    }
}
