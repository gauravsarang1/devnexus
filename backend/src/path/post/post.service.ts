import prisma from "../../config/prisma.js";
import { CreatePostDTO } from "./post.type.js";
import { PostHelper, postInclude } from "./post.helper.js";
import { PostNotifier } from "./post.notification.js";

export class PostService {
    static async findById(postId: string) {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: postInclude as any
        });

        if (!post) {
            throw new Error("Post not found");
        }

        return PostHelper.formatPost(post);
    }

    static async findByAuthorId(params: {
        authorId: string;
        page?: number;
        limit?: number;
        search?: string;
    }) {
        const {
            authorId,
            page = 1,
            limit = 10,
            search
        } = params;

        const skip = (page - 1) * limit;

        const where: any = {
            authorId,
            ...(search && {
                content: {
                    contains: search,
                    mode: "insensitive"
                }
            })
        };

        const [posts, total] = await prisma.$transaction([
            prisma.post.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: postInclude as any
            }),
            prisma.post.count({ where })
        ]);

        return {
            pegination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            posts: posts.map(PostHelper.formatPost)
        };
    }

    static async findMany(params?: {
        page?: number;
        limit?: number;
        search?: string;
    }) {
        const {
            page = 1,
            limit = 10,
            search
        } = params ?? {};

        const skip = (page - 1) * limit;

        const where: any = search
            ? {
                content: {
                    contains: search,
                    mode: "insensitive"
                }
            }
            : undefined;

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: postInclude as any
            }),
            prisma.post.count({ where })
        ]);

        return {
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            posts: posts.map((p) => PostHelper.formatPost(p))
        };
    }

    static async createPost(data: CreatePostDTO) {
        const post = await prisma.post.create({
            data: {
                content: data.content,
                authorId: data.authorId,
                mentionsOnPost: data.mentionsOnPost
                    ? {
                        createMany: {
                            data: data.mentionsOnPost
                        }
                    }
                    : undefined
            },
            include: postInclude as any
        });

        const formattedPost = PostHelper.formatPost(post);
        PostNotifier.onPostCreated(formattedPost).catch(console.error);

        return formattedPost;
    }

    static async updatePost(
        postId: string,
        authorId: string,
        data: Partial<CreatePostDTO>
    ) {
        return await prisma.$transaction(async (tx) => {
            const post = await tx.post.findFirst({
                where: {
                    id: postId,
                    authorId
                }
            });

            if (!post) {
                throw new Error("Post not found or unauthorized");
            }

            if (data.mentionsOnPost) {
                await tx.mentionOnPost.deleteMany({
                    where: { postId }
                });
            }

            const updatedPost = await tx.post.update({
                where: { id: postId },
                data: {
                    content: data.content,
                    mentionsOnPost: data.mentionsOnPost
                        ? {
                            createMany: {
                                data: data.mentionsOnPost
                            }
                        }
                        : undefined
                },
                include: {
                    mentionsOnPost: true
                }
            });

            return updatedPost;
        });
    }

    static async deletePost(postId: string, authorId: string) {
        const post = await prisma.post.findFirst({
            where: {
                id: postId,
                authorId
            }
        });

        if (!post) {
            throw new Error("Post not found or unauthorized");
        }

        await prisma.post.delete({
            where: { id: postId }
        });

        return { success: true };
    }
}
