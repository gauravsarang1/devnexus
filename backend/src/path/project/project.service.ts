import prisma from "../../config/prisma.js";
import { NotFoundError } from "../../errors/NotFoundError.js";

export class ProjectService {

    static create(userId: string, data: any) {
        return prisma.project.create({
            data: { ...data, userId },
        });
    }

    static async update(projectId: string, userId: string, data: any) {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.userId !== userId) {
            throw new NotFoundError("Project not found");
        }

        return prisma.project.update({
            where: { id: projectId },
            data,
        });
    }

    static getById(projectId: string) {
        return prisma.project.findUnique({
            where: { id: projectId },
            include: {
                logo: true,
                user: { select: { id: true, name: true, uId: true } },
            },
        });
    }

    static async delete(projectId: string, userId: string) {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.userId !== userId) {
            throw new NotFoundError("Project not found");
        }

        await prisma.project.delete({ where: { id: projectId } });
        return null;
    }
}
