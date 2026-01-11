
import prisma from '../../config/prisma.js';
import { ServiceResponse } from '../../types/serviceResponse.js';
import bcrypt from "bcryptjs";
import * as PrismaModule from '@prisma/client';
import { UserNotifier } from './user.notification.js';
import { deleteChache, getCache, setCache } from '../../utils/cache.js';

const { SkillRole } = PrismaModule;

export class UserService {
  private static formatUserWithPhotos(user: any) {
    if (!user) return null;
    const avatar = user.photo?.find((p: any) => p.type === 'AVATAR')?.url;
    const background = user.photo?.find((p: any) => p.type === 'BACKGROUND')?.url;

    // Cleanup internal fields
    const { photo, password, currentHashedRefreshToken, otp, otpExpiry, ...rest } = user;
    return { ...rest, avatar, background };
  }

  static async getUserById(id: string): Promise<ServiceResponse> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        skills: { include: { skill: true } },
        photo: true
      }
    });
    return { success: true, data: this.formatUserWithPhotos(user) };
  }

  static async getUserByUId(uId: string): Promise<ServiceResponse> {
    const cacheKey = `user:uId:${uId}`;
    const cachedUser = await getCache(cacheKey);
    if (cachedUser) {
      return {
        success: true,
        data: JSON.parse(cachedUser)
      }
    }
    const user = await prisma.user.findUnique({
      where: { uId },
      include: {
        skills: { include: { skill: true } },
        photo: true
      }
    });
    await setCache(cacheKey, this.formatUserWithPhotos(user), 180);
    return { success: true, data: this.formatUserWithPhotos(user) };
  }

  static async updatePushSubscription(userId: string, subscription: any): Promise<ServiceResponse> {
    await prisma.user.update({
      where: { id: userId },
      data: { pushSubscription: typeof subscription === 'string' ? subscription : JSON.stringify(subscription) }
    });
    return { success: true };
  }

  static async removePushSubscription(userId: string): Promise<ServiceResponse> {
    await prisma.user.update({
      where: { id: userId },
      data: { pushSubscription: null }
    });
    return { success: true };
  }

  static async getMutualSkills(userId: string, otherUserId: string): Promise<ServiceResponse> {
    const [me, them] = await Promise.all([
      prisma.skillOnUser.findMany({ where: { userId }, include: { skill: true } }),
      prisma.skillOnUser.findMany({ where: { userId: otherUserId }, include: { skill: true } })
    ]);

    const structuredMutual = me.reduce((acc: any[], mySkill) => {
      const matched = them.find(theirSkill => theirSkill.skillId === mySkill.skillId && theirSkill.role !== mySkill.role);
      if (matched) {
        acc.push({
          name: mySkill.skill.name,
          learningFromThem: mySkill.role === SkillRole.LEARN && matched.role === SkillRole.TEACH,
          teachingThem: mySkill.role === SkillRole.TEACH && matched.role === SkillRole.LEARN
        });
      }
      return acc;
    }, []);

    return { success: true, data: structuredMutual };
  }

  static async getDashboardActivity(userId: string): Promise<ServiceResponse> {
    const cacheKey = `user:data:${userId}:dashboard`;
    const cachedDashboard = await getCache(cacheKey);
    if (cachedDashboard) {
      console.log("dashboard getted from cache ✅")
      return {
        success: true,
        data: JSON.parse(cachedDashboard)
      }
    }
    const [pendingCount, recentChats, trendingSkills, suggestions, unreadNotifs] = await Promise.all([
      prisma.match.count({ where: { userBId: userId, status: 'PENDING' } }),
      prisma.chat.findMany({
        where: { participants: { some: { userId } } },
        include: {
          messages: { take: 1, orderBy: { createdAt: 'desc' } },
          participants: { include: { user: { include: { photo: { where: { type: 'AVATAR' }, take: 1 } } } } }
        },
        take: 3,
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.skill.findMany({ take: 10, orderBy: { popularity: 'desc' } }),
      this.getSuggestedMatches(userId, { limit: 6 }),
      prisma.notification.count({ where: { userId, isRead: false } })
    ]);

    const formattedChats = recentChats.map((c) => ({
      ...c,
      participants: c.participants.map((p) => ({
        ...p,
        user: { ...p.user, avatar: p.user.photo.find(p => p.type === "AVATAR")?.url! }
      }))
    }));

    const formattedResponse = {
      hasActivity: pendingCount > 0 || formattedChats.length > 0 || unreadNotifs > 0,
      pendingRequests: pendingCount,
      recentChats: formattedChats,
      trendingSkills,
      suggestions: suggestions.data.users,
      unreadNotificationsCount: unreadNotifs
    }

    await setCache(cacheKey, formattedResponse, 300);
    return {
      success: true,
      data: formattedResponse
    };
  }

  static async getSuggestedMatches(userId: string, params: any): Promise<ServiceResponse> {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `user:data${userId}:suggested:page:${page}`;
    const cachedSuggestedMatches = await getCache(cacheKey);
    if (cachedSuggestedMatches) {
      console.log("suggested matches from cache ✅");
      return {
        success: true,
        data: JSON.parse(cachedSuggestedMatches)
      }
    }

    const mySeeking = await prisma.skillOnUser.findMany({
      where: { userId, role: SkillRole.LEARN },
      select: { skillId: true }
    });
    const mySeekingIds = mySeeking.map(s => s.skillId);

    const existingMatches = await prisma.match.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      select: { userAId: true, userBId: true }
    });
    const excludedIds = Array.from(new Set([
      userId,
      ...existingMatches.map(m => m.userAId === userId ? m.userBId : m.userAId)
    ]));

    const where: any = {
      id: { notIn: excludedIds },
      skills: {
        some: {
          skillId: { in: mySeekingIds },
          role: SkillRole.TEACH
        }
      }
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          skills: { include: { skill: true } },
          photo: true
        },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    const formattedUsers = users.map(u => this.formatUserWithPhotos(u));
    const formattedResponse = {
      users: formattedUsers,
      pagination: {
        total,
        page,
        limit,
        hasNextPage: (page * limit) < total
      }
    }

    await setCache(cacheKey, formattedResponse, 180);
    return { success: true, data: formattedResponse };
  }

  static async getAllUsers(
    userId: string,
    params: any
  ): Promise<ServiceResponse> {

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;
    const search = params.search?.trim();

    const cacheKey = `user:data:${userId}:page:${page}:limit:${limit}:search:${search ?? 'none'}`;
    const cachedUsers = await getCache(cacheKey);

    if (cachedUsers) {
      console.log("users fetched from cache ✅");
      return {
        success: true,
        data: JSON.parse(cachedUsers),
      };
    }

    // 🔹 Build where condition safely
    const where: any = search
      ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { uId: { contains: search, mode: 'insensitive' } },
          {
            skills: {
              some: {
                skill: {
                  name: { contains: search, mode: 'insensitive' },
                },
              },
            },
          },
        ],
      }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          skills: { include: { skill: true } },
          photo: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    // 🔹 Fetch all accepted matches in ONE query
    const userIds = users.map(u => u.id);

    const matches = await prisma.match.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { userAId: userId, userBId: { in: userIds } },
          { userBId: userId, userAId: { in: userIds } },
        ],
      },
      select: {
        userAId: true,
        userBId: true,
      },
    });

    // 🔹 Convert matches to Set for fast lookup
    const connectedUserIds = new Set(
      matches.map(m =>
        m.userAId === userId ? m.userBId : m.userAId
      )
    );

    const formattedUsers = users.map(u => ({
      ...this.formatUserWithPhotos(u),
      isConnected: connectedUserIds.has(u.id),
    }));

    const response = {
      users: formattedUsers,
      pagination: {
        total,
        page,
        limit,
        hasNextPage: page * limit < total,
      },
    };

    await setCache(cacheKey, response, 180);

    return { success: true, data: response };
  }


  static async updateProfile(id: string, data: any): Promise<ServiceResponse> {
    const { avatar, background, ...rest } = data;

    const user = await prisma.user.update({ where: { id }, data: rest });

    if (avatar) {
      await prisma.photo.upsert({
        where: { userId_type: { userId: id, type: 'AVATAR' } },
        update: { url: avatar },
        create: { url: avatar, userId: id, type: 'AVATAR' }
      });
    }

    if (background) {
      await prisma.photo.upsert({
        where: { userId_type: { userId: id, type: 'BACKGROUND' } },
        update: { url: background },
        create: { url: background, userId: id, type: 'BACKGROUND' }
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id },
      include: { photo: true, skills: { include: { skill: true } } }
    });

    await deleteChache(`user:data:${user.id}`);
    await deleteChache(`user:uId${updatedUser?.uId}`);

    return { success: true, data: this.formatUserWithPhotos(updatedUser) };
  }

  static async changePassword(userId: string, current: string, next: string): Promise<ServiceResponse> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "User not found" };

    const valid = await bcrypt.compare(current, user.password);
    if (!valid) return { success: false, error: "Incorrect current password" };

    const hashed = await bcrypt.hash(next, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return { success: true };
  }

  static async deleteAccount(userId: string): Promise<ServiceResponse> {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
    await prisma.user.delete({ where: { id: userId } });
    if (user) {
      UserNotifier.accountCloseMail({
        name: user.name,
        email: user.email
      });
    }
    return { success: true };
  }
}
