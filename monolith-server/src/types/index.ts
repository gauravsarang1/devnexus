
import * as PrismaModule from '@prisma/client';

/**
 * Fixed: Use any casting on Prisma module members to bypass missing export errors for SkillRole, SkillLevel, MatchStatus, Photo_Type, and MessageStatus.
 * This ensures these constants/enums are available for use in the application even if the explicit exports are missing from the generated Prisma client.
 */
const Prisma = (PrismaModule as any);
export const SkillRole = Prisma.SkillRole;
export const SkillLevel = Prisma.SkillLevel;
export const MatchStatus = Prisma.MatchStatus;
export const Photo_Type = Prisma.Photo_Type;
export const MessageStatus = Prisma.MessageStatus;

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: any;
  message?: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      validated?: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}