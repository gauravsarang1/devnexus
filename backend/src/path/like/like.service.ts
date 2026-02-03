import prisma from "../../config/prisma.js";
import { LikeToggleInput } from "./like.type.js";
import { LikeNotifier } from "./like.notification.js";

export class LikeService {
    static async toggleLike(userId: string, data: LikeToggleInput) {
        const where =
            data.postId
                ? { userId, postId: data.postId }
                : data.projectId
                    ? { userId, projectId: data.projectId }
                    : { userId, reviewId: data.reviewId! };

        return prisma.$transaction(async (tx) => {
            const existing = await tx.like.findFirst({ where });

            if (existing) {
                await tx.like.delete({ where: { id: existing.id } });
                return { liked: false };
            }

            const like = await tx.like.create({
                data: {
                    likeType: data.likeType,
                    ...where
                }
            });

            LikeNotifier.onLikeCreated(like);
            return { liked: true };
        });
    }

    static async getAll(params: {
        postId?: string;
        projectId?: string;
        reviewId?: string;
        page?: number;
        limit?: number;
    }) {
        const {
            postId,
            projectId,
            reviewId,
            page = 1,
            limit = 20
        } = params;

        const skip = (page - 1) * limit;

        const where =
            postId
                ? { postId }
                : projectId
                    ? { projectId }
                    : { reviewId };

        const [likes, total] = await prisma.$transaction([
            prisma.like.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: {
                            id: true,
                            uId: true,
                            name: true,
                            photo: {
                                where: {
                                    type: "AVATAR"
                                },
                                take: 1,
                                orderBy: { createdAt: "desc" }
                            }
                        }
                    }
                }
            }),
            prisma.like.count({ where })
        ]);

        return {
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            likes: likes.map(like => ({
                id: like.id,
                createdAt: like.createdAt,
                user: {
                    id: like.user.id,
                    uId: like.user.uId,
                    name: like.user.name,
                    avatar: like.user.photo?.[0]?.url ?? null
                }
            }))
        };
    }
}
