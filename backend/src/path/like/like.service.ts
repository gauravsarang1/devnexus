import prisma from "../../config/prisma.js";
import { LikeToggleInput } from "./like.type.js";
import { LikeNotifier } from "./like.notification.js";

export class LikeService {
    static async toggleLike(
        userId: string,
        data: LikeToggleInput
    ) {
        const where = {
            userId,
            likeType: data.likeType,
            postId: data.postId ?? null,
            projectId: data.projectId ?? null,
            reviewId: data.reviewId ?? null
        };

        const existing = await prisma.like.findFirst({ where });

        if (existing) {
            await prisma.like.delete({
                where: { id: existing.id }
            });

            return { liked: false };
        }

        const like = await prisma.like.create({
            data: {
                userId,
                likeType: data.likeType,
                postId: data.postId,
                projectId: data.projectId,
                reviewId: data.reviewId
            }
        });

        LikeNotifier.onLikeCreated(like).catch(console.error);

        return { liked: true };
    }
}
