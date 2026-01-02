import apiClient from './apiClient';
import { Chat, ChatMessage } from '../src/types';
import { BaseApiResponse, PaginatedResponse } from '../src/utils/apiResponse';

export type ChatsPaginatedResponse = PaginatedResponse<Chat, 'chats'>;
export type MessagesPaginatedResponse = PaginatedResponse<ChatMessage, 'messages'>;
export type MessageResponse = BaseApiResponse<ChatMessage>;
export type ChatCreateResponse = BaseApiResponse<Chat>;

export const chatService = {
  getChats: async (page = 1, limit = 15): Promise<ChatsPaginatedResponse['data']> => {
    const response = await apiClient.get<ChatsPaginatedResponse>(`/chats?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  getMessages: async (chatId: string, page = 1, limit = 30): Promise<MessagesPaginatedResponse['data']> => {
    const response = await apiClient.get<MessagesPaginatedResponse>(`/messages/chat/${chatId}?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  sendMessage: async (chatId: string, text: string): Promise<ChatMessage> => {
    const response = await apiClient.post<MessageResponse>('/messages', { chatId, text });
    return response.data.data;
  },

  createChat: async (participantsIds: string[]): Promise<Chat> => {
    const response = await apiClient.post<ChatCreateResponse>('/chats', { participantsIds });
    return response.data.data;
  },

  updateMessageStatus: async (messageId: string, status: 'SENT' | 'DELIVERED' | 'READ'): Promise<ChatMessage> => {
    const response = await apiClient.put<MessageResponse>(`/messages/${messageId}/change-status`, { status });
    return response.data.data;
  },

  markChatAsSeen: async (chatId: string): Promise<BaseApiResponse<null>> => {
    const response = await apiClient.post<BaseApiResponse<null>>(`/messages/chat/${chatId}/seen`);
    return response.data;
  }
};
