import prisma from "../../config/prisma.js";
import { BadRequestError } from "../../errors/BadRequestError.js";
import { SaveToggleInput } from "./save.type.js";
import { SearchParams } from "../../types/search-params.js";

export class SaveService {
    static async toggleSave(
        saverId: string,
        data: SaveToggleInput
    ): Promise<{ saved: boolean }> {

        if (!!data.postId === !!data.projectId) {
            throw new BadRequestError(
                "Provide either postId or projectId (not both)"
            );
        }

        const where = data.postId
            ? { saverId, postId: data.postId }
            : { saverId, projectId: data.projectId };

        return prisma.$transaction(async (tsx) => {
            const existing = await prisma.save.findFirst({ where });

            if (existing) {
                await prisma.save.delete({
                    where: { id: existing.id },
                });

                return { saved: false };
            }

            await prisma.save.create({
                data: {
                    saverId,
                    postId: data.postId,
                    projectId: data.projectId,
                },
            });

            return { saved: true };
        })
    };

    static async getAllSaves(
        saverId: string,
        params: SearchParams & { saveType?: "POST" | "PROJECT" }
    ): Promise<{
        saves: any[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
            hasNextPage: boolean;
        };
    }> {

        const page = params.page ? parseInt(params.page as string, 10) : 1;
        const limit = params.limit ? parseInt(params.limit as string, 10) : 10;
        const skip = (page - 1) * limit;

        const where: any = { saverId };

        if (params.saveType === "POST") {
            where.postId = { not: null };
        }
        if (params.saveType === "PROJECT") {
            where.projectId = { not: null };
        }

        const [saves, total] = await prisma.$transaction([
            prisma.save.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    post: {
                        include: {
                            photos: true,
                            author: {
                                select: {
                                    id: true,
                                    name: true,
                                    uId: true,
                                },
                            },
                        },
                    },
                    project: {
                        include: {
                            logo: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    uId: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.save.count({ where }),
        ]);

        return {
            saves,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
            },
        };
    }
}
