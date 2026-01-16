import prisma from '../../config/prisma.js';
import { BadRequestError } from '../../errors/BadRequestError.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
import bcrypt from "bcryptjs";
import { SkillRole } from '@prisma/client';
import { UserNotifier } from './user.notification.js';
import { deleteChache, getCache, setCache } from '../../utils/cache.js';
import {
  UserProfile,
  UserProfileWithStatus,
  UserDashboardActivity,
  SuggestedMatchesResponse,
  AllUsersResponse,
  UpdateProfileDTO,
  MutualSkill,
  PaginationParams,
} from '../../types/service.types.js';

export class UserService {
  private static formatUserWithPhotos(user: UserProfile): Omit<UserProfile, 'photo' | 'password' | 'currentHashedRefreshToken' | 'otp' | 'otpExpiry'> | null {
    if (!user) return null;
    const avatar = user.photo?.find((p: any) => p.type === 'AVATAR')?.url;
    const background = user.photo?.find((p: any) => p.type === 'BACKGROUND')?.url;

    const { photo, password, currentHashedRefreshToken, otp, otpExpiry, ...rest } = user;
    return { ...rest, avatar, background };
  }

  static async getUserById(id: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { 
        id,
        isEmailVerified: true
      },
      include: {
        skills: { include: { skill: true } },
        photo: true
      }
    });

    if(!user) throw new NotFoundError("User not found");
    return this.formatUserWithPhotos(user) as UserProfile;
  }

  static async getUserByUId(uId: string, currentUserId: string): Promise<UserProfileWithStatus> {
    const cacheKey = `user:uId:${uId}:viewer:${currentUserId}`;
    const cachedUser = await getCache(cacheKey);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }
    const user = await prisma.user.findUnique({
      where: { 
        uId,
        isEmailVerified: true
      },
      include: {
        skills: { include: { skill: true } },
        photo: true,
      },
    
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    //find if user already connected or not
    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { userAId: currentUserId, userBId: user.id, status: { in: ['PENDING', 'ACCEPTED'] } },
          { userBId: currentUserId, userAId: user.id, status: { in: ['PENDING', 'ACCEPTED'] } },
        ],
      },
    });

    const formattedUser = {
      ...this.formatUserWithPhotos(user),
      status: match?.status || null,
      isConnected: !!match,
    };

    // Cache the user data for 3 minutes
    await setCache(cacheKey, formattedUser, 180);
    return formattedUser as UserProfileWithStatus;
  }

  static async updatePushSubscription(userId: string, subscription: any): Promise<null> {
    await prisma.user.update({
      where: { id: userId },
      data: { pushSubscription: typeof subscription === 'string' ? subscription : JSON.stringify(subscription) }
    });
    return null;
  }

  static async removePushSubscription(userId: string): Promise<null> {
    await prisma.user.update({
      where: { id: userId },
      data: { pushSubscription: null }
    });
    return null;
  }

  static async getMutualSkills(userId: string, otherUserId: string): Promise<MutualSkill[]> {
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

    return structuredMutual;
  }

  static async getDashboardActivity(userId: string): Promise<UserDashboardActivity> {
    const cacheKey = `user:data:${userId}:dashboard`;
    const cachedDashboard = await getCache(cacheKey);
    if (cachedDashboard) {
      console.log("dashboard fetched from cache ✅");
      return JSON.parse(cachedDashboard);
    }
    const [pendingCount, recentChats, trendingSkills, suggestions, unreadNotifs] = await Promise.all([
      prisma.match.count({ where: { userBId: userId, status: 'PENDING' } }),
      prisma.chat.findMany({
        where: { participants: { some: { userId } } },
        include: {
          messages: { take: 1, orderBy: { createdAt: 'desc' } },
          participants: { include: { user: { include: { name: true, photo: { where: { type: 'AVATAR' }, take: 1 } } } } }
          
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
        name: p.user.name,
        id: p.user.id,
        avatar: p.user.photo.find(ph => ph.type === "AVATAR")?.url || null
      }))
    }));

    const formattedResponse = {
      hasActivity: pendingCount > 0 || formattedChats.length > 0 || unreadNotifs > 0,
      pendingRequests: pendingCount,
      recentChats: formattedChats,
      trendingSkills,
      suggestions: suggestions.users,
      unreadNotificationsCount: unreadNotifs
    }

    await setCache(cacheKey, formattedResponse, 300);
    return formattedResponse;
  }

  static async getSuggestedMatches(userId: string, params: any): Promise<SuggestedMatchesResponse> {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `user:data${userId}:suggested:page:${page}:limit:${limit}`;
    const cachedSuggestedMatches = await getCache(cacheKey);
    if (cachedSuggestedMatches) {
      console.log("suggested matches from cache ✅");
      return JSON.parse(cachedSuggestedMatches);
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
      },
      isEmailVerified: true
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

    const formattedUsers = users.map(u => this.formatUserWithPhotos(u)).filter(Boolean);
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
    return formattedResponse as SuggestedMatchesResponse;
  }

  static async getAllUsers(
    userId: string,
    params: PaginationParams
  ): Promise<AllUsersResponse> {
    console.log("User", userId)

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;
    const search = params.search?.trim();

    const cacheKey = `user:data:${userId}:page:${page}:limit:${limit}:search:${search ?? 'none'}`;
    const cachedUsers = await getCache(cacheKey);

    if (cachedUsers) {
      console.log("users fetched from cache ✅");
      return JSON.parse(cachedUsers);
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
        isEmailVerified: true,
      }
      : {
        isEmailVerified: true,
      };

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
        OR: [
          { userAId: userId, userBId: { in: userIds }, status: { in: ['ACCEPTED', 'PENDING'] } },
          { userBId: userId, userAId: { in: userIds }, status: { in: ['ACCEPTED', 'PENDING'] } },
        ],
      },
      select: {
        userAId: true,
        userBId: true,
        status: true,
      },
    });

    //create Map of connected user ids for quick lookup
    const matchStatusMap = new Map<string, string>();
    matches.forEach(m => {
      const otherUserId = m.userAId === userId ? m.userBId : m.userAId;
      matchStatusMap.set(otherUserId, m.status);
    });

    // 🔹 Format users with match status
    const formattedUsers = users.map(u => ({
      ...this.formatUserWithPhotos(u),
      status: matchStatusMap.get(u.id) || null,
      isConnected: matchStatusMap.has(u.id),
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

    return response as AllUsersResponse;
  }


  static async updateProfile(id: string, data: UpdateProfileDTO): Promise<UserProfile> {
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

    if (!updatedUser) throw new NotFoundError("User not found");

    await deleteChache(`user:data:${user.id}`);
    await deleteChache(`user:uId${updatedUser?.uId}`);

    return this.formatUserWithPhotos(updatedUser) as UserProfile;
  }

  static async changePassword(userId: string, current: string, next: string): Promise<null> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User not found");

    const valid = await bcrypt.compare(current, user.password);
    if (!valid) throw new BadRequestError("Incorrect current password");

    const hashed = await bcrypt.hash(next, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return null;
  }

  static async deleteAccount(userId: string): Promise<null> {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
    await prisma.user.delete({ where: { id: userId } });
    if (user) {
      UserNotifier.accountCloseMail({
        name: user.name,
        email: user.email
      });
    }
    return null;
  }
}
