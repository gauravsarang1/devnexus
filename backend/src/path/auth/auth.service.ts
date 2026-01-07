import bcrypt from "bcryptjs";
import prisma from "../../config/prisma.js";
import { ServiceResponse } from "../../types/serviceResponse.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import * as PrismaModule from "@prisma/client";
import { generate6DigitOtp } from '../../utils/generate6DigitOtp.js';
import { AuthNotifier } from "./auth.notification.js";
import { getCache, setCache } from "../../utils/cache.js";

const { SkillRole, SkillLevel } = PrismaModule as any;

export interface RegisterDTO {
    name: string;
    uId: string;
    email: string;
    password: string;
    offeredSkills?: string[];
    seekingSkills?: string[];
}

export interface LoginDTO {
    emailORUid: string;
    password: string;
}

export interface UserResponse {
    name: string;
    email: string;
}

export interface JwtPayload {
    userId: string;
    iat: number;
    exp: number;
}

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 min
const REFRESH_ROTATION_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 1 day

// Curated high-quality mesh gradients for profile backgrounds
const DEFAULT_BANNERS = [
    "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80", // Blue/Purple
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1200&q=80", // Dark Blue
    "https://images.unsplash.com/photo-1557682224-5b8590cb9cfa?auto=format&fit=crop&w=1200&q=80", // Pink/Orange
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80", // Rainbow Mesh
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1200&q=80", // White/Grey abstract
];

export class authService {
    static async registerUser(data: RegisterDTO): Promise<ServiceResponse<UserResponse>> {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            if (existingUser.isEmailVerified) {
                return { success: false, error: "User already exists" };
            } else {
                await prisma.user.delete({ where: { email: data.email } });
            }
        }

        const otp = generate6DigitOtp();
        if (!otp) {
            return {
                success: false,
                error: "Failed to generate otp!"
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const cleanOffered = Array.from(new Set(data.offeredSkills || []));
        const cleanSeeking = Array.from(new Set(data.seekingSkills || []));

        // Generate Random Assets
        const randomBanner = DEFAULT_BANNERS[Math.floor(Math.random() * DEFAULT_BANNERS.length)];
        // DiceBear Lorelei is a trendy Gen-Z friendly avatar style
        const diceBearAvatar = `https://api.dicebear.com/7.x/lorelei/svg?seed=${data.uId}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    uId: data.uId,
                    name: data.name,
                    otp: otp,
                    otpExpiry: otpExpiry
                }
            });

            // Auto-assign Photos to prevent blank states
            await tx.photo.createMany({
                data: [
                    { userId: newUser.id, url: diceBearAvatar, type: 'AVATAR' },
                    { userId: newUser.id, url: randomBanner, type: 'BACKGROUND' }
                ]
            });

            if (cleanOffered.length > 0) {
                for (const skillName of cleanOffered) {
                    const skill = await tx.skill.upsert({
                        where: { name: skillName },
                        update: {},
                        create: { name: skillName, popularity: 1 }
                    });
                    await tx.skillOnUser.create({
                        data: {
                            userId: newUser.id,
                            skillId: skill.id,
                            role: SkillRole.TEACH,
                            level: SkillLevel.EXPERT
                        }
                    });
                }
            }

            if (cleanSeeking.length > 0) {
                for (const skillName of cleanSeeking) {
                    const skill = await tx.skill.upsert({
                        where: { name: skillName },
                        update: {},
                        create: { name: skillName, popularity: 1 }
                    });
                    await tx.skillOnUser.create({
                        data: {
                            userId: newUser.id,
                            skillId: skill.id,
                            role: SkillRole.LEARN,
                            level: SkillLevel.BEGINNER
                        }
                    });
                }
            }

            return newUser;
        });

        AuthNotifier.verifyEmailMail({
            name: user.name,
            email: user.email,
            otp
        });

        return { success: true, data: { name: user.name, email: user.email } };
    }

    static async me(userId: string): Promise<ServiceResponse> {
        const cacheKey = `user:data:${userId}`;

        // 1️⃣ Check cache first
        const cachedUser = await getCache(cacheKey);
        if (cachedUser) {
            console.log("me returnerd from cache ✅")
            return {
                success: true,
                data: JSON.parse(cachedUser),
            };
        }

        // 2️⃣ Fetch from DB
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                uId: true,
                isEmailVerified: true,
                skills: {
                    include: { skill: true }
                },
                photo: true
            }
        });

        if (!user) return { success: false, error: "User not found" };
        if (!user.isEmailVerified) return { success: false, error: "User is not verified" };

        // 3️⃣ Format user (frontend-ready)
        const avatar = user.photo?.find(p => p.type === "AVATAR")?.url ?? null;
        const background = user.photo?.find(p => p.type === "BACKGROUND")?.url ?? null;
        const { photo, ...rest } = user;

        const formattedUser = {
            ...rest,
            avatar,
            background,
        };

        // 4️⃣ Save to cache (TTL = 5 min)
        await setCache(cacheKey, formattedUser, 300);

        return { success: true, data: formattedUser };
    }

    static async verifyEmailOtp(payload: { email: string; otp: string }): Promise<ServiceResponse<UserResponse>> {
        const user = await prisma.user.findUnique({ where: { email: payload.email } });

        if (!user) return { success: false, error: "User not found" };
        if (user.isEmailVerified) return { success: false, error: "Email already verified" };
        if (user.otp !== payload.otp) return { success: false, error: "Invalid OTP" };
        if (user.otpExpiry! < new Date()) return { success: false, error: "OTP has expired" };

        const updatedUser = await prisma.user.update({
            where: { email: payload.email },
            data: { isEmailVerified: true, otp: null, otpExpiry: null },
            select: { name: true, email: true }
        });

        AuthNotifier.verificationSuccessMail({
            name: user.name,
            email: user.email
        });

        return { success: true, data: updatedUser };
    }

    static async loginUser(data: LoginDTO): Promise<ServiceResponse & { accessToken?: string; refreshToken?: string }> {
        const user = await prisma.user.findFirst({
            where: { OR: [{ email: data.emailORUid }, { uId: data.emailORUid }] },
        });

        if (!user) return { success: false, error: "User not found" };
        if (!user.isEmailVerified) return { success: false, error: "Email is not verified yet" };

        const valid = await bcrypt.compare(data.password, user.password);
        if (!valid) return { success: false, error: "Incorrect password" };

        const accessToken = generateAccessToken(user.id, ACCESS_TOKEN_TTL_MS);
        const refreshToken = generateRefreshToken(user.id);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: { currentHashedRefreshToken: hashedRefreshToken }
        });

        return { success: true, accessToken, refreshToken };
    }

    static async delete(userId: string): Promise<ServiceResponse> {
        await prisma.user.delete({
            where: {
                id: userId
            }
        });

        return {
            success: true
        }
    }

    static async refreshToken(token: string | undefined): Promise<ServiceResponse & { accessToken?: string; refreshToken?: string }> {
        if (!token) return { success: false, error: "No token provided" };
        const payload = verifyRefreshToken(token) as JwtPayload;
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });

        if (!user || !user.currentHashedRefreshToken) return { success: false, error: "Invalid token" };
        const isValid = await bcrypt.compare(token, user.currentHashedRefreshToken);
        if (!isValid) return { success: false, error: "Invalid token" };

        const now = Date.now();
        const refreshExpMs = payload.exp * 1000;
        const refreshRemainingMs = refreshExpMs - now;

        if (refreshRemainingMs <= 0) return { success: false, error: "Refresh token expired" };

        const accessTokenTtlMs = Math.min(ACCESS_TOKEN_TTL_MS, refreshRemainingMs);
        const accessToken = generateAccessToken(user.id, accessTokenTtlMs);

        if (refreshRemainingMs <= REFRESH_ROTATION_THRESHOLD_MS) {
            const newRefreshToken = generateRefreshToken(user.id);
            const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 12);
            await prisma.user.update({
                where: { id: user.id },
                data: { currentHashedRefreshToken: hashedRefreshToken },
            });
            return { success: true, accessToken, refreshToken: newRefreshToken };
        }

        return { success: true, accessToken };
    }
}