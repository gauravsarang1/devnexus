
import prisma from '../../config/prisma.js'
import { ServiceResponse } from '../../types/serviceResponse.js'
import * as PrismaModule from '@prisma/client'
import { sendMail } from '../../email/sendMail.js'
import skillUpdateEmailHtml from '../../email/template/skillUpdateEmailHtml.js'

const { SkillRole, SkillLevel } = PrismaModule as any;

export interface CreateSkillOnUser {
    skillId?: string
    skillName?: string
    userId: string
    role: any 
    level?: any 
    note?: string
}

export type UpdateSkillOnUserDTO = Partial<CreateSkillOnUser>

export class SkillOnUser {
    static async createSkillOnUser(data:CreateSkillOnUser): Promise<ServiceResponse> {
        let { skillId, userId, role, skillName, level, note } = data;
        
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
        if (!user) return { success: false, error: "User not found" };

        if (!skillId && skillName) {
            const skill = await prisma.skill.upsert({
                where: { name: skillName },
                update: { popularity: { increment: 1 } },
                create: { name: skillName, popularity: 1 }
            });
            skillId = skill.id;
        }

        if (!skillId) return { success: false, error: "Skill ID or Name is required" };

        const existingSkill = await prisma.skill.findUnique({ where: { id: skillId } });
        if(!existingSkill) return { success: false, error: "Skill does not exist" };

        const duplicate = await prisma.skillOnUser.findFirst({
            where: { userId, skillId, role }
        });

        if (duplicate) {
            const category = role === 'TEACH' ? 'Expertise' : 'Learning Goals';
            return { 
                success: false, 
                error: `${existingSkill.name} is already in your ${category}.` 
            };
        }

        const skillOnUser = await prisma.skillOnUser.create({ 
            data: { skillId, userId, role, level, note } 
        });

        const emailHtml = skillUpdateEmailHtml(user.name, existingSkill.name, role, level);
        await sendMail(user.email, `New Skill Added: ${existingSkill.name}`, emailHtml);

        return { success: true, data: skillOnUser };
    }

    static async updateSkillOnUser(
        skillOnUserId: string,
        currentUserId: string,
        data: UpdateSkillOnUserDTO
    ): Promise<ServiceResponse> {
        const record = await prisma.skillOnUser.findUnique({ 
            where: { id: skillOnUserId },
            include: { skill: true, user: { select: { name: true, email: true } } }
        });
        if (!record) return { success: false, error: "Skill record not found" };
        if (record.userId !== currentUserId) return { success: false, error: "Unauthorized" };
        
        const updated = await prisma.skillOnUser.update({ where: { id: skillOnUserId }, data });

        const emailHtml = skillUpdateEmailHtml(record.user.name, record.skill.name, record.role, data.level || record.level);
        await sendMail(record.user.email, `Skill Level Updated: ${record.skill.name}`, emailHtml);

        return { success: true, data: updated };
    }

    static async deleteSkillOnUser(skillOnUserId: string, currentUserId: string): Promise<ServiceResponse> {
        const record = await prisma.skillOnUser.findUnique({ where: { id: skillOnUserId } });
        if (!record) return { success: false, error: "SkillOnUser not found" };
        if (record.userId !== currentUserId) return { success: false, error: "Unauthorized" };
        const deleted = await prisma.skillOnUser.delete({ where: { id: skillOnUserId } });
        return { success: true, data: deleted };
    }

    static async getSkillOnUserById(skillOnUserId: string): Promise<ServiceResponse> {
        const result = await prisma.skillOnUser.findUnique({
            where: { id: skillOnUserId },
            include: { skill: true, user: true },
        });
        return { success: true, data: result };
    }

    static async getSkillsOnUserByUserId(userId: string): Promise<ServiceResponse> {
        const result = await prisma.skillOnUser.findMany({
            where: { userId },
            include: { skill: true }
        });
        return { success: true, data: result };
    }

    static async getMatchingSkills(payload: {currentUserId: string, otherUserId: string}): Promise<ServiceResponse> {
        const [currentUserSkills, otherUserSkills] = await Promise.all([
            prisma.skillOnUser.findMany({
                where: { userId: payload.currentUserId },
                include: { skill: true }
            }),
            prisma.skillOnUser.findMany({
                where: { userId: payload.otherUserId },
                include: { skill: true }
            })
        ]);

        const matchedSkills = currentUserSkills.filter(mySkill => 
            otherUserSkills.some(theirSkill => 
                mySkill.skillId === theirSkill.skillId && mySkill.role !== theirSkill.role
            )
        ).map(ms => ms.skill.name);

        return { success: true, data: Array.from(new Set(matchedSkills)) };
    }

    static async getAllSkillOnUsers(): Promise<ServiceResponse> {
        const list = await prisma.skillOnUser.findMany({
            include: { skill: true, user: true }
        });
        return { success: true, data: list };
    }
}
