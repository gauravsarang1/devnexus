
import prisma from '../../config/prisma.js'
import { ServiceResponse } from '../../types/serviceResponse.js'

export interface CreateSkillDTO {
    name: string;
    description?: string;
    slug?: string;
    popularity?: number;
    icon?: string;
}

export type UpdateSkillDTO = Partial<CreateSkillDTO>;

export class skillService {
    static async createSkill(data: CreateSkillDTO): Promise<ServiceResponse> {
        const skill = await prisma.skill.create({ data });
        return { success: true, data: skill };
    }

    static async updateSkill(id: string, data: UpdateSkillDTO): Promise<ServiceResponse> {
        const skill = await prisma.skill.update({
            where: { id },
            data,
        });
        return { success: true, data: skill };
    }

    static async deleteSkill(id: string): Promise<ServiceResponse> {
        const deleted = await prisma.skill.delete({
            where: { id },
        });
        return { success: true, data: deleted };
    }

    static async getAllSkills(params: any = {}): Promise<ServiceResponse> {
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 20;
        const skip = (page - 1) * limit;

        const [skills, total] = await Promise.all([
            prisma.skill.findMany({
                orderBy: { popularity: 'desc' },
                skip,
                take: limit
            }),
            prisma.skill.count()
        ]);

        const hasNextPage = page * limit < total;

        return { 
            success: true, 
            data: { 
                skills, 
                pagination: { total, page, limit, hasNextPage } 
            } 
        };
    }

    static async getSkillById(id: string): Promise<ServiceResponse> {
        const skill = await prisma.skill.findUnique({
            where: { id },
        });
        return { success: true, data: skill };
    }
}
