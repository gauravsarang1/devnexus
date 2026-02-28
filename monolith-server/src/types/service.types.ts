/**
 * Comprehensive service types for full type-safety
 * Maps directly to Prisma schema
 */

import {
  User as PrismaUser,
  Skill as PrismaSkill,
  SkillOnUser as PrismaSkillOnUser,
  Match as PrismaMatch,
  Chat as PrismaChat,
  Message as PrismaMessage,
  Notification as PrismaNotification,
  Review as PrismaReview,
  Photo as PrismaPhoto,
  Save as PrismaSave,
  SkillRole,
  SkillLevel,
  MatchStatus,
  MessageStatus,
  Photo_Type,
  NotificationType,
  SaveType,
} from '@prisma/client';

// ============================================
// AUTH SERVICE TYPES
// ============================================

export interface RegisterDTO {
  name: string;
  uId: string;
  email: string;
  password: string;
  offeredSkills?: string[];
  seekingSkills?: string[];
  avatar?: string;
  background?: string;
}

export interface LoginDTO {
  emailORUid: string;
  password: string;
}

export interface VerifyEmailOtpDTO {
  email: string;
  otp: string;
}

export interface RefreshTokenDTO {
  token: string | undefined;
}

export interface AuthTokenResponse {
  accessToken?: string;
  refreshToken?: string;
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

// ============================================
// USER SERVICE TYPES
// ============================================

export interface UserProfile {
  id: string;
  uId?: string | null;
  email: string;
  password?: string;
  name: string;
  bio?: string | null;
  isEmailVerified: boolean;
  otp?: string | null;
  otpExpiry?: Date | null;
  pushSubscription?: string | null;
  currentHashedRefreshToken?: string | null;
  skills: SkillOnUserWithSkill[];
  photo?: Photo[];
  avatar?: string | null;
  background?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillOnUserWithSkill {
  id: string;
  userId: string;
  skillId: string;
  role: SkillRole;
  level: SkillLevel;
  note?: string | null;
  skill: Skill;
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  popularity: number;
  icon?: string | null;
  createdAt: Date;
}

export interface UserProfileWithStatus extends UserProfile {
  status: MatchStatus | null;
  isConnected: boolean;
  hasReviewed: boolean | null;
}

export interface ResendChat extends Partial<Chat>{
  messages: {
    text: true
  }[]
  participants: {
    name: string
    id: string
    avatar?: string
  }[],
}

export interface UserDashboardActivity {
  hasActivity: boolean;
  pendingRequests: number;
  recentChats: ResendChat[];
  trendingSkills: PrismaSkill[];
  suggestions: UserProfile[];
  unreadNotificationsCount: number;
}

export interface SuggestedMatchesResponse {
  users: UserProfile[];
  pagination: PaginationInfo;
}

export interface AllUsersResponse {
  users: UserProfileWithStatus[];
  pagination: PaginationInfo;
}

export interface UpdateProfileDTO {
  name?: string;
  bio?: string;
  avatar?: string;
  background?: string;
}

export interface ChangePasswordDTO {
  current: string;
  next: string;
}

export interface PushSubscriptionDTO {
  subscription: any;
}

// ============================================
// SKILL SERVICE TYPES
// ============================================

export interface SkillDTO {
  name: string;
  category?: string;
  description?: string;
  popularity?: number;
  icon?: string;
}

export interface SkillWithLevel {
  id: string;
  userId: string;
  skillId: string;
  role: SkillRole;
  level: SkillLevel;
  note?: string | null;
  createdAt: Date;
  skill: {
    id: string;
    name: string;
    category?: string | null;
    description?: string | null;
    popularity: number;
    icon?: string | null;
    createdAt: Date;
  };
}

export interface SkillOnUserDTO {
  skillId: string;
  role: SkillRole;
  level?: SkillLevel;
  note?: string;
}

// ============================================
// MATCH SERVICE TYPES
// ============================================

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  status: MatchStatus;
  createdAt: Date;
  updatedAt: Date;
  skills: MatchSkill[];
}

export interface MatchSkill {
  id: string;
  matchId: string;
  skillId: string;
}

export interface MatchDTO {
  userAId: string;
  userBId: string;
  skillIds?: string[];
}

export interface MatchResponse {
  id: string;
  userAId: string;
  userBId: string;
  status: MatchStatus;
  userA: UserProfilePreview;
  userB: UserProfilePreview;
  matchedSkills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AllMatchesResponse {
  matches: MatchResponse[];
  pagination: PaginationInfo;
}

export interface UpdateMatchStatusDTO {
  matchId: string;
  status: 'ACCEPTED' | 'DECLINED';
}

// ============================================
// CHAT SERVICE TYPES
// ============================================

export interface CreateChatDTO {
  participants: string[];
}

export interface Chat {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatPreview {
  id: string;
  participants: UserProfilePreview[];
  messages?: MessageResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatDetail {
  id: string;
  participants: UserProfilePreview[];
  messages: MessageResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AllChatsResponse {
  chats: ChatPreview[];
  pagination: PaginationInfo;
}

// ============================================
// MESSAGE SERVICE TYPES
// ============================================

export interface SendMessageDTO {
  chatId: string;
  text: string;
}

export interface MessageResponse {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  status: MessageStatus;
  seenBy: string[];
  createdAt: Date;
  user?: {
    name: string;
    photo?: Photo[];
  };
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  status: MessageStatus;
  seenBy: string[];
  createdAt: Date;
}


export interface GetMessagesResponse {
  messages: MessageResponse[];
  pagination: PaginationInfo;
}

export interface EditMessageDTO {
  messageId: string;
  text: string;
}

export interface SeenByDTO {
  messageId: string;
}

export interface MarkChatAsSeenDTO {
  chatId: string;
}

export interface MessageSocketPayload {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  status: MessageStatus;
  seenBy: string[];
  createdAt: Date;
}

// ============================================
// NOTIFICATION SERVICE TYPES
// ============================================

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  payload?: string | null;
  createdAt: Date;
}

export interface NotificationDTO {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  payload?: any;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  payload?: any;
  createdAt: Date;
}

export interface NotificationListResponse {
  notifications: NotificationResponse[];
  unreadCount: number;
}

export interface MarkNotificationAsReadDTO {
  notificationId: string;
}

// ============================================
// PHOTO SERVICE TYPES
// ============================================

export interface Photo {
  id: string;
  url: string;
  userId: string;
  type: Photo_Type;
}

export interface UploadPhotoDTO {
  url: string;
  type: Photo_Type;
}

// ============================================
// SAVE SERVICE TYPES
// ============================================

export interface SaveDTO {
  type: SaveType;
  userId?: string;
  matchId?: string;
}

export interface SaveResponse {
  id: string;
  saverId: string;
  type: SaveType;
  userId?: string | null;
  matchId?: string | null;
  createdAt: Date;
  user?: UserProfilePreview;
  match?: MatchResponse;
}

export interface AllSavesResponse {
  saves: SaveResponse[];
  pagination: PaginationInfo;
}

// ============================================
// SKILL ON USER SERVICE TYPES
// ============================================

export interface AddSkillDTO {
  skillId: string;
  role: SkillRole;
  level?: SkillLevel;
  note?: string;
}

export interface UpdateSkillDTO {
  skillOnUserId: string;
  level?: SkillLevel;
  note?: string;
}

// ============================================
// COMMON TYPES
// ============================================

export interface UserProfilePreview {
  id: string;
  name: string;
  uId?: string;
  avatar?: string | null;
  email?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

// ============================================
// MUTUAL SKILLS
// ============================================

export interface MutualSkill {
  name: string;
  learningFromThem: boolean;
  teachingThem: boolean;
}

// ============================================
// RESPONSE WRAPPER (for controllers)
// ============================================

export interface ApiSuccessResponse<T = any> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: any;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
