
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
  isConnected?: boolean;
  hasReviewed: boolean | null
  isCurrentUser?: boolean;
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

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  reviewerId: string;
  reviewedUserId: string;
  reviewer?: Partial<User>;
  reviewedUser?: Partial<User>
  createdAt?: string
}

export interface CreateReviewDTO {
  rating?: number;
  reviewedUserId: string;
  comment?: string;
}

export interface Post{
    id: string;
    content: string;

    author: {
        id: string;
        uId: string;
        name: string;
        avatar: string | null;
    };

    createdAt: string;
    updatedAt: string;

    mentions: {
        id: string;
        mentionType: string;

        user: {
            id: string;
            uId: string;
            name: string;
            avatar: string | null;
        } | null;

        project: {
            id: string;
            title: string;
            slug: string;
            logo: string | null;
        } | null;
    }[];
}


export type Author = {
  id: string;
  uId: string;
  name: string;
  avatar: string | null;
};

export type MentionEntry = {
  id: string;
  mentionType: string;
  user: {
    id: string;
    uId: string;
    name: string;
    avatar: string | null;
  } | null;
  project: {
    id: string;
    title: string;
    slug: string;
    logo: string | null;
  } | null;
};

export type Mention = {
  id: string;
  name: string;
  avatar: string | null;
  uId?: string;
  type: 'user' | 'project';
};

export type Comment = {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  replies?: Comment[];
};

export interface Post {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  mentions: MentionEntry[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isSaved: boolean;
}

export type FeedType = 'global' | 'personalized' | 'trending';

export type CreatePostPayload = {
  content: string;
  mentionsOnPost: any[];
};

export type UserProfile = {
  id: string;
  name: string;
  avatar: string;
  uId: string;
};

export type ProjectProfile = {
  id: string;
  name: string;
  avatar: string;
};

/* ---------------- Sub Types ---------------- */

export type ProjectOwner = {
  id: string;
  name: string;
  uId: string;
};

export type ProjectLogo = {
  id: string;
  url: string;
};

export type ProjectSkill = {
  id: string;
  skill: {
    id: string;
    name: string;
    category?: string;
    icon?: string;
  };
};

export type ProjectCounts = {
  likes: number;
  saves: number;
  reviews: number;
  comments?: number;
};

/* ---------------- Main Project Type ---------------- */

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;

  tagline?: string;
  whyBuilt?: string;
  architecture?: string;

  githubUrl?: string;
  previewUrl?: string;

  createdAt: string;
  updatedAt: string;

  /* -------- Relations -------- */

  user: ProjectOwner;
  logo?: ProjectLogo | null;
  techs: ProjectSkill[];

  _count?: ProjectCounts;
}
