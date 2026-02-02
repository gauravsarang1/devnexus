import { Post, User } from "@prisma/client";

export class PostHelper {
    static formatUser(user: any) {
        const { photo = [], ...rest } = user ?? {};
        return {
            ...rest,
            avatar: photo[0]?.url ?? null,
        };
    }

    static formatPost(post: any) {
        return {
            id: post.id,
            content: post.content,

            author: post.author ? this.formatUser(post.author): null,

            createdAt: post.createdAt,
            updatedAt: post.updatedAt,

            mentions: (post.mentionsOnPost ?? []).map((m: any) => ({
                id: m.id,
                mentionType: m.mentionType,

                user: m.user ? this.formatUser(m.user) : null,

                project: m.project
                    ? {
                        id: m.project.id,
                        title: m.project.title,
                        slug: m.project.slug,
                        logo: m.project.logo
                    }
                    : null
            }))
        };
    }
}

export const postInclude = {
    author: {
        select: {
            id: true,
            name: true,
            uId: true,
            photo: {
                where: {
                    type: "AVATAR"
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 1
            }
        }
    },
    mentionsOnPost: {
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    uId: true,
                    photo: {
                        where: {
                            type: "AVATAR"
                        },
                        orderBy: {
                            createdAt: "desc"
                        },
                        take: 1
                    }
                }
            },
            project: true
        }
    }
};