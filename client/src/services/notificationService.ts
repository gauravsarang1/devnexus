
import apiClient from './apiClient';
import { Notification } from '../types';
import { BaseApiResponse, PaginatedResponse } from '../utils/apiResponse';

export type NotificationPaginatedResponse = PaginatedResponse<Notification, 'notifications'>;
export type UnreadCountResponse = BaseApiResponse<{ count: number }>;
export type SimpleNotifActionResponse = BaseApiResponse<null>;

export const notificationService = {
  getNotifications: async (page = 1, limit = 15): Promise<NotificationPaginatedResponse['data']> => {
    const response = await apiClient.get<NotificationPaginatedResponse>(`/notifications?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data.data.count;
  },

  markRead: async (id: string): Promise<SimpleNotifActionResponse> => {
    const response = await apiClient.put<SimpleNotifActionResponse>(`/notifications/${id}/mark-read`);
    return response.data;
  },

  markAllRead: async (): Promise<SimpleNotifActionResponse> => {
    const response = await apiClient.put<SimpleNotifActionResponse>('/notifications/mark-all-read');
    return response.data;
  }
};
