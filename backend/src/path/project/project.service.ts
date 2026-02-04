import prisma from "../../config/prisma.js";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { SearchParams } from "../../types/search-params.js";
import { CreateProjectInput, UpdateProjectInput } from "./project.type.js";

export class ProjectService {

    static async create(userId: string, data: CreateProjectInput) {
        const { skillIds = [], ...projectData } = data;

        return prisma.project.create({
            data: {
                ...projectData,
                userId,
                techs: {
                    create: skillIds.map(skillId => ({ skillId })),
                },
            },
            include: {
                logo: true,
                techs: {
                    include: { skill: true },
                },
            },
        });
    }

    static async update(
        projectId: string,
        userId: string,
        data: UpdateProjectInput
    ) {
        const project = await prisma.project.findUnique({ where: { id: projectId } });

        if (!project || project.userId !== userId) {
            throw new NotFoundError("Project not found");
        }

        const { skillIds, ...updateData } = data;

        return prisma.project.update({
            where: { id: projectId },
            data: {
                ...updateData,
                ...(skillIds && {
                    techs: {
                        deleteMany: {},
                        create: skillIds.map(skillId => ({ skillId })),
                    },
                }),
            },
            include: {
                logo: true,
                techs: {
                    include: { skill: true },
                },
            },
        });
    }

    static async getById(projectId: string) {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                logo: true,
                user: {
                    select: { id: true, name: true, uId: true },
                },
                techs: {
                    include: { skill: true },
                },
                _count: {
                    select: {
                        likes: true,
                        saves: true,
                        reviews: true,
                        comments: true,
                    },
                },
            },
        });

        if (!project) {
            throw new NotFoundError("Project not found");
        }

        return project;
    }

    static async delete(projectId: string, userId: string) {
        const project = await prisma.project.findUnique({ where: { id: projectId } });

        if (!project || project.userId !== userId) {
            throw new NotFoundError("Project not found");
        }

        await prisma.project.delete({ where: { id: projectId } });
        return null;
    }

    static async getBySlug(slug: string) {
        const project = await prisma.project.findUnique({
            where: { slug },
            include: {
                logo: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        uId: true,
                    },
                },
                techs: {
                    include: {
                        skill: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        saves: true,
                        reviews: true,
                        comments: true,
                    },
                },
            },
        });

        if (!project) {
            throw new NotFoundError("Project not found");
        }

        return project;
    }

    static async getByUserId(userId: string, params: SearchParams) {
        const page = params.page ? parseInt(params.page, 10) : 1;
        const limit = params.limit ? parseInt(params.limit, 10) : 10;
        const skip = (page - 1) * limit;

        const where = { userId };

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    logo: true,
                    techs: {
                        include: { skill: true },
                    },
                },
            }),
            prisma.project.count({ where }),
        ]);

        return {
            projects,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
            },
        };
    }

    static async getAllProjects(params: SearchParams) {
        const page = params.page ? parseInt(params.page, 10) : 1;
        const limit = params.limit ? parseInt(params.limit, 10) : 10;
        const skip = (page - 1) * limit;

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    logo: true,
                    user: {
                        select: { id: true, name: true, uId: true },
                    },
                    techs: {
                        include: { skill: true },
                    },
                },
            }),
            prisma.project.count(),
        ]);

        return {
            projects,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
            },
        };
    }

    static async getPersonalizedFeed(
        userId: string,
        params: SearchParams
    ) {
        const page = params.page ? parseInt(params.page, 10) : 1;
        const limit = params.limit ? parseInt(params.limit, 10) : 10;
        const skip = (page - 1) * limit;

        const userSkills = await prisma.skillOnUser.findMany({
            where: { userId },
            select: { skillId: true },
        });

        const skillIds = userSkills.map(s => s.skillId);

        const where = skillIds.length
            ? {
                techs: {
                    some: {
                        skillId: { in: skillIds },
                    },
                },
            }
            : {};

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    logo: true,
                    user: {
                        select: { id: true, name: true, uId: true },
                    },
                    techs: {
                        include: { skill: true },
                    },
                },
            }),
            prisma.project.count({ where }),
        ]);

        return {
            projects,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
            },
        };
    }

    static async getTrendingProjects(params: SearchParams) {
        const page = params.page ? parseInt(params.page, 10) : 1;
        const limit = params.limit ? parseInt(params.limit, 10) : 10;
        const skip = (page - 1) * limit;

        const projects = await prisma.project.findMany({
            skip,
            take: limit,
            include: {
                logo: true,
                user: {
                    select: { id: true, name: true, uId: true },
                },
                techs: {
                    include: { skill: true },
                },
                _count: {
                    select: {
                        likes: true,
                        saves: true,
                        reviews: true,
                    },
                },
            },
            orderBy: [
                { likes: { _count: "desc" } },
                { saves: { _count: "desc" } },
                { reviews: { _count: "desc" } },
                { createdAt: "desc" },
            ],
        });

        const total = await prisma.project.count();

        return {
            projects,
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
