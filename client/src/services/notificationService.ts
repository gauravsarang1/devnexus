import apiClient from './apiClient';
import { Notification } from '../types';
import { BaseApiResponse, PaginatedResponse } from '../utils/apiResponse';
import { unwrap } from '../utils/apiHelper';

export type NotificationPaginatedResponse =
  PaginatedResponse<Notification, 'notifications'>;

export type UnreadCountResponse = BaseApiResponse<{ count: number }>;
export type SimpleNotifActionResponse = BaseApiResponse<null>;

export const notificationService = {
  getNotifications: async (
    page = 1,
    limit = 15
  ): Promise<NotificationPaginatedResponse['data']> => {
    const res = await apiClient.get<NotificationPaginatedResponse>(
      `/notifications?page=${page}&limit=${limit}`
    );
    return res.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const { count } = unwrap(
      await apiClient.get<UnreadCountResponse>(
        '/notifications/unread-count'
      )
    );
    return count;
  },

  markRead: async (id: string): Promise<null> =>
    unwrap(
      await apiClient.put<SimpleNotifActionResponse>(
        `/notifications/${id}/mark-read`
      )
    ),

  markAllRead: async (): Promise<null> =>
    unwrap(
      await apiClient.put<SimpleNotifActionResponse>(
        '/notifications/mark-all-read'
      )
    ),
};
