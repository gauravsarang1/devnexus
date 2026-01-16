
import prisma from '../../config/prisma.js'
import { BadRequestError } from '../../errors/BadRequestError.js'
import { NotFoundError } from '../../errors/NotFoundError.js'
import * as PrismaModule from '@prisma/client'
import { sendMail } from '../../email/sendMail.js'
import skillUpdateEmailHtml from '../../email/template/skillUpdateEmailHtml.js'
import {
    SkillOnUserDTO,
    SkillWithLevel,
} from '../../types/service.types.js';

const { SkillRole, SkillLevel } = PrismaModule as any;

export class SkillOnUser {
    static async createSkillOnUser(data: SkillOnUserDTO & { userId: string }): Promise<SkillWithLevel> {
        let { skillId, userId, role, skillName, level, note } = data;
        
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
        if (!user) throw new NotFoundError("User not found");

        if (!skillId && skillName) {
            const skill = await prisma.skill.upsert({
                where: { name: skillName },
                update: { popularity: { increment: 1 } },
                create: { name: skillName, popularity: 1 }
            });
            skillId = skill.id;
        }

        if (!skillId) throw new BadRequestError("Skill ID or Name is required");

        const existingSkill = await prisma.skill.findUnique({ where: { id: skillId } });
        if(!existingSkill) throw new NotFoundError("Skill does not exist");

        const duplicate = await prisma.skillOnUser.findFirst({
            where: { userId, skillId, role }
        });

        if (duplicate) {
            const category = role === 'TEACH' ? 'Expertise' : 'Learning Goals';
            throw new BadRequestError(`${existingSkill.name} is already in your ${category}.`);
        }

        const skillOnUser = await prisma.skillOnUser.create({ 
            data: { skillId, userId, role, level, note } 
        });

        const emailHtml = skillUpdateEmailHtml(user.name, existingSkill.name, role, level);
        await sendMail(user.email, `New Skill Added: ${existingSkill.name}`, emailHtml);

        return skillOnUser;
    }

    static async updateSkillOnUser(
        skillOnUserId: string,
        currentUserId: string,
        data: Partial<SkillOnUserDTO>
    ): Promise<SkillWithLevel> {
        const record = await prisma.skillOnUser.findUnique({ 
            where: { id: skillOnUserId },
            include: { skill: true, user: { select: { name: true, email: true } } }
        });
        if (!record) throw new NotFoundError("Skill record not found");
        if (record.userId !== currentUserId) throw new BadRequestError("Unauthorized");
        
        const updated = await prisma.skillOnUser.update({ where: { id: skillOnUserId }, data });

        const emailHtml = skillUpdateEmailHtml(record.user.name, record.skill.name, record.role, data.level || record.level);
        await sendMail(record.user.email, `Skill Level Updated: ${record.skill.name}`, emailHtml);

        return updated;
    }

    static async deleteSkillOnUser(skillOnUserId: string, currentUserId: string): Promise<null> {
        const record = await prisma.skillOnUser.findUnique({ where: { id: skillOnUserId } });
        if (!record) throw new NotFoundError("SkillOnUser not found");
        if (record.userId !== currentUserId) throw new BadRequestError("Unauthorized");
        const deleted = await prisma.skillOnUser.delete({ where: { id: skillOnUserId } });
        return null;
    }

    static async getSkillOnUserById(skillOnUserId: string): Promise<SkillWithLevel> {
        const result = await prisma.skillOnUser.findUnique({
            where: { id: skillOnUserId },
            include: { skill: true, user: true },
        });
        if (!result) throw new NotFoundError("SkillOnUser not found");

        return result;
    }

    static async getSkillsOnUserByUserId(userId: string): Promise<SkillWithLevel[]> {
        const result = await prisma.skillOnUser.findMany({
            where: { userId },
            include: { skill: true }
        });
        return result;
    }

    static async getMatchingSkills(payload: {currentUserId: string, otherUserId: string}): Promise<string[]> {
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

        return Array.from(new Set(matchedSkills));
    }

    static async getAllSkillOnUsers(): Promise<SkillWithLevel[]> {
        const list = await prisma.skillOnUser.findMany({
            include: { skill: true, user: true }
        });
        return list;
    }
}
