
import prisma from '../../config/prisma.js'
// Service methods return raw data or throw errors; controllers handle HTTP responses
import {
    SkillDTO,
} from '../../types/service.types.js';
import { Skill } from '@prisma/client';

export class skillService {
    static async createSkill(data: SkillDTO): Promise<Skill> {
        const skill = await prisma.skill.create({ data });
        return skill;
    }

    static async updateSkill(id: string, data: Partial<SkillDTO>): Promise<Skill> {
        const skill = await prisma.skill.update({ where: { id }, data });
        return skill;
    }

    static async deleteSkill(id: string): Promise<null> {
        const deleted = await prisma.skill.delete({ where: { id } });
        return null;
    }

    static async getAllSkills(params: any = {}): Promise<{ skills: Skill[]; pagination: { total: number; page: number; limit: number; hasNextPage: boolean } }> {
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

        return { skills, pagination: { total, page, limit, hasNextPage } };
    }

    static async getSkillById(id: string): Promise<Skill | null> {
        const skill = await prisma.skill.findUnique({ where: { id } });
        return skill;
    }
}
