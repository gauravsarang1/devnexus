
import prisma from '../../config/prisma.js';
import { ServiceResponse } from '../../types/serviceResponse.js';
import { getCache, invalidateMatchCache, setCache } from '../../utils/cache.js';
import { MatchNotifier } from './match.notifications.js';

export class MatchService {
    static async getAllMatches(userId: string, type: string, params: any = {}): Promise<ServiceResponse> {
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 10;
        const skip = (page - 1) * limit;

        const cacheKey = `match:user:${userId}:page:${page}:type:${type}`;

        let where: any = {};

        if (type === 'incoming') {
            where = { userBId: userId, status: 'PENDING' };
        } else if (type === 'sent') {
            where = { userAId: userId, status: 'PENDING' };
        } else if (type === 'active') {
            where = {
                OR: [{ userAId: userId }, { userBId: userId }],
                status: 'ACCEPTED'
            };
        } else {
            where = { OR: [{ userAId: userId }, { userBId: userId }] };
        }

        const cachedMatches = await getCache(cacheKey);
        if (cachedMatches) {
            console.log("match response from cache")
            return {
                success: true,
                data: JSON.parse(cachedMatches)
            }
        }

        const [matches, total] = await Promise.all([
            prisma.match.findMany({
                where,
                include: {
                    userA: { include: { photo: { where: { type: 'AVATAR' }, take: 1 } } },
                    userB: { include: { photo: { where: { type: 'AVATAR' }, take: 1 } } },
                    skills: { include: { skill: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.match.count({ where })
        ]);

        const hasNextPage = page * limit < total;

        const formattedMatches = matches.map((m: any) => {
            const userA = { ...m.userA, avatar: m.userA.photo?.[0]?.url };
            const userB = { ...m.userB, avatar: m.userB.photo?.[0]?.url };
            return {
                ...m,
                userA,
                userB,
                // Flatten the MatchSkill join table for the frontend
                matchedSkills: m.skills.map((ms: any) => ms.skill.name)
            };
        });

        const formatedResponse = {
            matches: formattedMatches,
            pagination: {
                total,
                page,
                limit,
                hasNextPage
            }
        }

        await setCache(cacheKey, formatedResponse, 180);

        return {
            success: true,
            data: formatedResponse
        };
    }

    static async sendMatchRequest(senderId: string, targetUserId: string): Promise<ServiceResponse> {
        if (senderId === targetUserId) return { success: false, error: "You cannot match with yourself" };

        const existing = await prisma.match.findFirst({
            where: {
                OR: [
                    { userAId: senderId, userBId: targetUserId },
                    { userAId: targetUserId, userBId: senderId }
                ]
            }
        });

        if (existing) return { success: false, error: "Connection already exists or is pending" };

        const sender = await prisma.user.findUnique({ where: { id: senderId }, select: { name: true } });

        const [userASkills, userBSkills] = await Promise.all([
            prisma.skillOnUser.findMany({ where: { userId: senderId }, include: { skill: true } }),
            prisma.skillOnUser.findMany({ where: { userId: targetUserId }, include: { skill: true } }),
        ]);

        const matchedSkillIds = userASkills
            .filter(a => userBSkills.some(b => b.skillId === a.skillId && b.role !== a.role))
            .map(s => s.skillId);

        const match = await prisma.match.create({
            data: {
                userAId: senderId,
                userBId: targetUserId,
                status: 'PENDING',
                skills: {
                    create: matchedSkillIds.map(sid => ({ skillId: sid }))
                }
            }
        });

        MatchNotifier.matchRequested({
            targetUserId,
            senderName: sender?.name || 'Someone',
            matchId: match.id
        });

        await invalidateMatchCache(senderId, match.id);
        await invalidateMatchCache(targetUserId, match.id);

        return { success: true, data: match };
    }

    static async updateMatchStatus(userId: string, matchId: string, status: 'ACCEPTED' | 'DECLINED'): Promise<ServiceResponse> {
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: {
                userB: { select: { name: true } },
                userA: { select: { id: true, name: true, email: true } }
            }
        });
        if (!match || match.userBId !== userId) return { success: false, error: "Unauthorized or record not found" };
        if (match.status !== 'PENDING') {
            return { success: false, error: 'Match already processed' };
        }

        const result = await prisma.$transaction(async (tx) => {
            if (status === 'DECLINED') {
                const deleteMatch = await tx.match.delete({
                    where: {
                        id: matchId
                    }
                })

                return deleteMatch;
            }

            const updated = await tx.match.update({
                where: { id: matchId },
                data: { status }
            });

            if (status === 'ACCEPTED') {
                const participants = [match.userAId, match.userBId];

                const existingChat = await tx.chat.findFirst({
                    where: {
                        AND: participants.map(id => ({
                            participants: { some: { userId: id } }
                        }))
                    }
                });

                if (!existingChat) {
                    await tx.chat.create({
                        data: {
                            participants: {
                                createMany: {
                                    data: participants.map(pid => ({ userId: pid }))
                                }
                            }
                        }
                    });
                }

                MatchNotifier.matchAccepted({
                    requesterId: match.userAId,
                    requesterEmail: match.userA.email,
                    requesterName: match.userA.name,
                    accepterName: match.userB.name,
                    matchId: match.id,
                });
            }
            return updated;
        });

        await invalidateMatchCache(userId, matchId);
        await invalidateMatchCache(match.userBId, matchId);

        return { success: true, data: result };
    }

    static async getMatchById(matchId: string): Promise<ServiceResponse> {
        const cacheKey = `match:data:${matchId}`;
        const cachedMatch = await getCache(cacheKey);
        if (cachedMatch) {
            return {
                success: true,
                data: JSON.parse(cachedMatch)
            }
        }
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: { userA: true, userB: true, skills: { include: { skill: true } } }
        });
        if (!match) return { success: false, error: "Match not found" };
        await setCache(cacheKey, match, 500);
        return { success: true, data: match };
    }
}
