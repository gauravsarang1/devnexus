
import axios from 'axios';
import { Post, FeedType, CreatePostPayload, UserProfile, ProjectProfile, Comment } from '@/src/types/index';

const api = axios.create({
  baseURL: '/api',
});

const MOCK_AUTHORS = [
  { id: '1', uId: '@arivera', name: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: '2', uId: '@designlabs', name: 'Design Labs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design' },
  { id: '3', uId: '@schen', name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    content: 'This looks incredible! The UI is so clean.',
    author: MOCK_AUTHORS[2],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likeCount: 12,
    isLiked: false,
    replies: [
      {
        id: 'c2',
        content: 'I agree, Sarah! The attention to detail is great.',
        author: MOCK_AUTHORS[0],
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        likeCount: 4,
        isLiked: true,
      }
    ]
  },
  {
    id: 'c3',
    content: 'Are there any plans for a dark mode soon?',
    author: { id: '4', uId: '@dark_knight', name: 'Bruce W.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bruce' },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likeCount: 2,
    isLiked: false,
  }
];

const createMockPost = (id: string, feedType: FeedType): Post => ({
  id,
  content: `Check out our latest progress on the SocialStream module! We've just integrated rich mentions and nested comments. What do you think?`,
  author: MOCK_AUTHORS[Math.floor(Math.random() * MOCK_AUTHORS.length)],
  mentions: [
    {
      id: 'm1',
      mentionType: 'PROJECT',
      user: null,
      project: { id: 'p1', title: 'Nexus AI', slug: 'nexus-ai', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Nexus' }
    }
  ],
  likeCount: Math.floor(Math.random() * 100),
  commentCount: 3,
  isLiked: false,
  isSaved: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const mockApi = {
  getPosts: async (type: FeedType, page: number): Promise<{ data: Post[], nextCursor?: number }> => {
    await new Promise(r => setTimeout(r, 600));
    const posts = Array.from({ length: 5 }, (_, i) => createMockPost(`${type}-${page}-${i}`, type));
    return { data: posts, nextCursor: page + 1 };
  },
  createPost: async (payload: CreatePostPayload): Promise<Post> => {
    await new Promise(r => setTimeout(r, 800));
    return {
      id: Math.random().toString(36).substr(2, 9),
      content: payload.content,
      author: MOCK_AUTHORS[0],
      mentions: [],
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  searchUsers: async (query: string): Promise<UserProfile[]> => {
    await new Promise(r => setTimeout(r, 300));
    const users: UserProfile[] = [
      { id: 'u1', name: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', uId: '@arivera' },
      { id: 'u2', name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', uId: '@schen' },
      { id: 'u3', name: 'David Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', uId: '@dsmith' },
      { id: 'u4', name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', uId: '@ewilson' },
      { id: 'u5', name: 'Andrew Ng', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andrew', uId: '@andrew_ng' },
    ];
    return users.filter(u => 
      u.name.toLowerCase().includes(query.toLowerCase()) || 
      u.uId.toLowerCase().includes(query.toLowerCase())
    );
  },
  searchProjects: async (query: string): Promise<ProjectProfile[]> => {
    await new Promise(r => setTimeout(r, 300));
    const projects: ProjectProfile[] = [
      { id: 'p1', name: 'Nexus AI', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Nexus' },
      { id: 'p2', name: 'EcoFlow', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Eco' },
      { id: 'p3', name: 'Design Labs', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Design' },
      { id: 'p4', name: 'Solaris', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Solaris' },
    ];
    return projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  },
  getComments: async (postId: string): Promise<Comment[]> => {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_COMMENTS;
  },
  createComment: async (postId: string, content: string, parentId?: string): Promise<Comment> => {
    await new Promise(r => setTimeout(r, 600));
    return {
      id: Math.random().toString(36).substr(2, 9),
      content,
      author: MOCK_AUTHORS[0],
      createdAt: new Date().toISOString(),
      likeCount: 0,
      isLiked: false,
    };
  },
  toggleLike: async (postId: string) => {
    await new Promise(r => setTimeout(r, 100));
    return true;
  },
  toggleSave: async (postId: string) => {
    await new Promise(r => setTimeout(r, 100));
    return true;
  }
};

export default api;
