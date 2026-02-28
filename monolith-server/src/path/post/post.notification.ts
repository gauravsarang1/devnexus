import io from "../../sockets/socketHandlers.js";
import { NotificationService } from "../notification/notification.service.js";
import { NotificationType } from "@prisma/client";
import { PostResponse } from "./post.type.js";

export class PostNotifier {
    private static buildMentionNotification(post: PostResponse) {
        return {
            type: NotificationType.MENTION,
            title: "You were mentioned",
            message: `${post.author.name} mentioned you in a post.`,
            link: `/posts/${post.id}`,
            payload: {
                postId: post.id
            }
        };
    }

    private static getMentionedUserIds(post: PostResponse): string[] {
        if (!post.mentions?.length) return [];

        return post.mentions
            .filter(m => m.user?.id)
            .map(m => m.user!.id);
    }

    static async onPostCreated(post: PostResponse) {
        const mentionedUserIds = this.getMentionedUserIds(post);

        if (!mentionedUserIds.length) return;

        const notification = this.buildMentionNotification(post);

        const uniqueUserIds = [
            ...new Set(
                mentionedUserIds.filter(
                    userId => userId !== post.author.id
                )
            )
        ];

        await Promise.all(
            uniqueUserIds.map(userId =>
                NotificationService.createNotification({
                    userId,
                    ...notification
                }).catch(console.error)
            )
        );

        uniqueUserIds.forEach(userId => {
            io.to(`user:${userId}`).emit("notification", notification);
        });
    }
}
