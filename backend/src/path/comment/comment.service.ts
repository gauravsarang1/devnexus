import prisma from "../../config/prisma.js";
import { BadRequestError } from "../../errors/BadRequestError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { CreateCommentDTO } from "./comment.type.js";
import { SearchParams } from "../../types/search-params.js";

export class CommentService {

    static async createComment(authorId: string, data: CreateCommentDTO) {
        if (!!data.postId === !!data.projectId) {
            throw new BadRequestError("Invalid comment target");
        }

        return prisma.comment.create({
            data: {
                content: data.content,
                authorId,
                postId: data.postId,
                projectId: data.projectId,
                parentCommentId: data.parentCommentId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        uId: true,
                        photo: { where: { type: "AVATAR" }, take: 1 },
                    },
                },
            },
        });
    }

    static async getComments(
        target: { postId?: string; projectId?: string },
        params: SearchParams
    ) {
        const page = params.page ? parseInt(params.page, 10) : 1;
        const limit = params.limit ? parseInt(params.limit, 10) : 10;
        const skip = (page - 1) * limit;

        const where = {
            ...(target.postId && { postId: target.postId }),
            ...(target.projectId && { projectId: target.projectId }),
            parentCommentId: null,
        };

        const [comments, total] = await prisma.$transaction([
            prisma.comment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            uId: true,
                            photo: { where: { type: "AVATAR" }, take: 1 },
                        },
                    },
                },
            }),
            prisma.comment.count({ where }),
        ]);

        return { comments, total };
    }

    static async deleteComment(commentId: string, userId: string) {
        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) throw new NotFoundError("Comment not found");
        if (comment.authorId !== userId) {
            throw new BadRequestError("Unauthorized");
        }

        await prisma.comment.delete({ where: { id: commentId } });
        return null;
    }
}
