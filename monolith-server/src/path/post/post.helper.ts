import { formatUser } from "../../utils/formats.js";

export class PostHelper {
    static formatPost(post: any) {
        return {
            id: post.id,
            content: post.content,

            author: post.author ? formatUser(post.author): null,

            createdAt: post.createdAt,
            updatedAt: post.updatedAt,

            mentions: (post.mentionsOnPost ?? []).map((m: any) => ({
                id: m.id,
                mentionType: m.mentionType,

                user: m.user ? formatUser(m.user) : null,

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

export const buildSearchWhere = (search?: string) => {
    if (!search) return undefined;

    return {
        content: {
            contains: search,
            mode: "insensitive" as const,
        },
    };
};

