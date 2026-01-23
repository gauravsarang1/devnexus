import apiClient from './apiClient';
import { User, Skill } from '../types';
import { BaseApiResponse, PaginatedResponse } from '../utils/apiResponse';
import { unwrap } from '../utils/apiHelper';

export interface UserSearchFilters {
  query?: string;
  skill?: string;
  page?: number;
  limit?: number;
}

export interface ProfileUserData extends User {
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

export type UserPaginatedResponse =
  PaginatedResponse<ProfileUserData, 'users'>;

export type DashboardResponse = BaseApiResponse<DashboardActivity>;
export type ProfileResponse = BaseApiResponse<ProfileUserData>;

export const userService = {
  searchUsers: async (
    filters: UserSearchFilters
  ): Promise<UserPaginatedResponse['data']> => {
    const params = new URLSearchParams();

    if (filters.query) params.append('search', filters.query);
    if (filters.skill) params.append('skill', filters.skill);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const res = await apiClient.get<UserPaginatedResponse>(
      `/users?${params.toString()}`
    );

    return res.data.data;
  },

  getSuggestions: async (
    page = 1,
    limit = 10
  ): Promise<UserPaginatedResponse['data']> => {
    const res = await apiClient.get<UserPaginatedResponse>(
      `/users/suggestions?page=${page}&limit=${limit}`
    );

    return res.data.data;
  },

  getProfile: async (userIdORuId: string): Promise<ProfileUserData> =>
    unwrap(
      await apiClient.get<ProfileResponse>(
        `/users/${userIdORuId}`
      )
    ),

  updateProfile: async (data: Partial<User>): Promise<User> =>
    unwrap(
      await apiClient.put<BaseApiResponse<User>>(
        '/users/update-profile',
        data
      )
    ),

  getDashboardActivity: async (): Promise<DashboardActivity> =>
    unwrap(
      await apiClient.get<DashboardResponse>(
        '/users/activity'
      )
    ),

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<null> =>
    unwrap(
      await apiClient.put<BaseApiResponse<null>>(
        '/users/change-password',
        { currentPassword, newPassword }
      )
    ),

  savePushSubscription: async (subscription: any): Promise<null> =>
    unwrap(
      await apiClient.post<BaseApiResponse<null>>(
        '/users/push-subscribe',
        { subscription }
      )
    ),

  removePushSubscription: async (): Promise<null> =>
    unwrap(
      await apiClient.get<BaseApiResponse<null>>(
        '/users/remove-subscribe'
      )
    ),
};
