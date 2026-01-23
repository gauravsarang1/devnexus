import apiClient from './apiClient';
import { unwrap } from '../utils/apiHelper';
import { Chat, ChatMessage } from '../types';
import { BaseApiResponse, PaginatedResponse } from '../utils/apiResponse';

export type ChatsPaginatedResponse = PaginatedResponse<Chat, 'chats'>;
export type MessagesPaginatedResponse = PaginatedResponse<ChatMessage, 'messages'>;

export const chatService = {
  getChats: async (page = 1, limit = 15) => {
    const res = await apiClient.get<ChatsPaginatedResponse>(
      `/chats?page=${page}&limit=${limit}`
    );
    return res.data.data;
  },

  getMessages: async (chatId: string, page = 1, limit = 30) => {
    const res = await apiClient.get<MessagesPaginatedResponse>(
      `/messages/chat/${chatId}?page=${page}&limit=${limit}`
    );
    return res.data.data;
  },

  sendMessage: async (chatId: string, text: string) =>
    unwrap(
      await apiClient.post<BaseApiResponse<ChatMessage>>('/messages', {
        chatId,
        text,
      })
    ),

  createChat: async (participantsIds: string[]) =>
    unwrap(
      await apiClient.post<BaseApiResponse<Chat>>('/chats', {
        participantsIds,
      })
    ),

  updateMessageStatus: async (
    messageId: string,
    status: 'SENT' | 'DELIVERED' | 'READ'
  ) =>
    unwrap(
      await apiClient.put<BaseApiResponse<ChatMessage>>(
        `/messages/${messageId}/change-status`,
        { status }
      )
    ),

  editMessage: async (messageId: string, newText: string) =>
    unwrap(
      await apiClient.put<BaseApiResponse<ChatMessage>>(
        `/messages/${messageId}`,
        { newText }
      )
    ),

  markChatAsSeen: async (chatId: string) =>
    unwrap(
      await apiClient.post<BaseApiResponse<null>>(
        `/messages/chat/${chatId}/seen`
      )
    ),

  deleteMessage: async (messageId: string) =>
    unwrap(
      await apiClient.delete<BaseApiResponse<null>>(
        `/messages/${messageId}`
      )
    ),
};
