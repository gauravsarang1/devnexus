import prisma from "../../config/prisma.js";
import { CreatePostDTO } from "./post.type.js";
import { PostHelper, postInclude, buildSearchWhere } from "./post.helper.js";
import { buildPagination, parsePaginationParams } from "../../utils/pagination.js";
import { PostNotifier } from "./post.notification.js";
import { SearchParams } from "../../types/search-params.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { BadRequestError } from "../../errors/BadRequestError.js";

export class PostService {
    static async findById(postId: string) {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: postInclude as any
        });

        if (!post) {
            throw new NotFoundError("Post not found");
        }

        return PostHelper.formatPost(post);
    }

    static async findByAuthorId(params: SearchParams & {
        authorId: string,
        search?: string
    }) {
        const { page, limit } = parsePaginationParams(params);
        const search = params.search;
        const authorId = params.authorId;
        const skip = (page - 1) * limit;

        const where: any = {
            authorId,
            ...(buildSearchWhere(search))
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
            pagination: buildPagination(page, limit, total),
            posts: posts.map(PostHelper.formatPost)
        };
    }

    static async getGlobalFeed(params: SearchParams & {
        search?: string
    }) {
        const { page, limit } = parsePaginationParams(params);
        const search = params.search;
        const skip = (page - 1) * limit;

        const where = buildSearchWhere(search);

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
            pagination: buildPagination(page, limit, total),
            posts: posts.map((p) => PostHelper.formatPost(p))
        };
    }

    static async getPersonalizedFeed(
        userId: string,
        params: SearchParams & { search?: string }
    ) {
        const { page, limit } = parsePaginationParams(params);
        const search = params.search;
        const skip = (page - 1) * limit;

        const userSkills = await prisma.skillOnUser.findMany({
            where: { userId },
            select: { skillId: true }
        });
        const skillIds = userSkills.map(s => s.skillId);

        if (skillIds.length === 0) {
            return this.getGlobalFeed(params);
        }

        const where = {
            ...buildSearchWhere(search),
            mentionsOnPost: {
                some: {
                    project: {
                        techs: {
                            some: {
                                skillId: { in: skillIds },
                            },
                        },
                    },
                },
            },
        };

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: postInclude as any
            }),
            prisma.post.count({
                where
            })
        ]);

        return {
            posts: posts.map((p) => PostHelper.formatPost(p)),
            pagination: buildPagination(page, limit, total)
        };
    }

    static async getTrendingFeed(params: SearchParams & { search?: string }) {
        const { page, limit } = parsePaginationParams(params);
        const search = params.search;
        const skip = (page - 1) * limit;

        const where = buildSearchWhere(search)

        const posts = await prisma.post.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                { likes: { _count: "desc" } },
                { comments: { _count: "desc" } },
                { createdAt: "desc" }
            ],
            include: postInclude as any
        });

        const total = await prisma.post.count({ where });

        return {
            posts: posts.map(PostHelper.formatPost),
            pagination: buildPagination(page, limit, total)
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
                throw new BadRequestError("Post not found or unauthorized");
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
            throw new BadRequestError("Post not found or unauthorized");
        }

        await prisma.post.delete({
            where: { id: postId }
        });

        return { success: true };
    }
}
