import apiClient from './apiClient';
import { User, Skill } from '../types';
import { BaseApiResponse, PaginatedResponse } from '../utils/apiResponse';

export interface UserSearchFilters {
  query?: string;
  skill?: string;
  page?: number;
  limit?: number;
}

export interface ProfileUserData  extends User {
  isConnected?: boolean;
  status?: string | null;
}

export interface DashboardActivity {
  hasActivity: boolean;
  pendingRequests: number;
  recentChats: any[];
  trendingSkills: Skill[];
  suggestions: User[];
  unreadNotificationsCount: number;
}

export type UserPaginatedResponse = PaginatedResponse<ProfileUserData, 'users'>;
export type DashboardResponse = BaseApiResponse<DashboardActivity>;
export type ProfileResponse = BaseApiResponse<ProfileUserData>;

export const userService = {
  searchUsers: async (filters: UserSearchFilters): Promise<UserPaginatedResponse['data']> => {
    const params = new URLSearchParams();
    if (filters.query) params.append('search', filters.query);
    if (filters.skill) params.append('skill', filters.skill);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await apiClient.get<UserPaginatedResponse>(`/users?${params.toString()}`);
    return response.data.data;
  },

  getSuggestions: async (page = 1, limit = 10): Promise<UserPaginatedResponse['data']> => {
    const response = await apiClient.get<UserPaginatedResponse>(`/users/suggestions?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  getProfile: async (userIdORuId: string): Promise<ProfileResponse['data']> => {
    const response = await apiClient.get<ProfileResponse>(`/users/${userIdORuId}`);
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<BaseApiResponse<User>>('/users/update-profile', data);
    return response.data.data;
  },

  getDashboardActivity: async (): Promise<DashboardActivity> => {
    const response = await apiClient.get<DashboardResponse>('/users/activity');
    return response.data.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<BaseApiResponse<null>> => {
    const response = await apiClient.put<BaseApiResponse<null>>('/users/change-password', { currentPassword, newPassword });
    return response.data;
  },

  savePushSubscription: async (subscription: any): Promise<BaseApiResponse<null>> => {
    const response = await apiClient.post<BaseApiResponse<null>>('/users/push-subscribe', { subscription });
    return response.data;
  },

  removePushSubscription: async (): Promise<BaseApiResponse<null>> => {
    const response = await apiClient.get<BaseApiResponse<null>>('/users/remove-subscribe');
    return response.data;
  }
};
