
export type SkillRole = 'TEACH' | 'LEARN';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
export type MatchStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';
export type NotificationType = 'CHAT' | 'MATCH_REQUEST' | 'MATCH_ACCEPTED' | 'SYSTEM' | 'SKILL_UPDATE' | 'REVIEW';

export interface Skill {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  description?: string;
  popularity: number;
  icon?: string;
}

export interface SkillOnUser {
  id: string;
  skillId: string;
  userId: string;
  role: SkillRole;
  level: SkillLevel;
  note?: string;
  skill: Skill;
}

export interface User {
  id: string;
  uId: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  background?: string;
  isEmailVerified: boolean;
  skills?: SkillOnUser[];
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  status: MatchStatus;
  matchedSkills: string[];
  userA?: User;
  userB?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  chatId: string;
  createdAt: string;
  status: MessageStatus;
  seenBy: string[];
  sender: {
    name: string;
    avatar: string | null;
    uId: string;
  };
}

export interface ChatParticipant {
  id: string;
  userId: string;
  chatId: string;
  joinedAt: string;
  user: User;
}

export interface Chat {
  id: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  payload?: string;
  createdAt: string;
}

export interface SocketNotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  payload?: Record<string, any>;
}

export interface SocketPresencePayload {
  userId: string;
}

export interface SocketTypingPayload {
  chatId: string;
  userId: string;
  isTyping: boolean;
}
