import apiClient from './apiClient';
import { BaseApiResponse } from '../utils/apiResponse';

export interface UidSuggestionsResponse extends BaseApiResponse<string[]> {}
export interface RefinementResponse extends BaseApiResponse<{ refined: string }> {}
export interface AssistantResponse extends BaseApiResponse<{ answer: string }> {}
export interface SearchSuggestionsResponse extends BaseApiResponse<string[]> {}

export const aiService = {
  suggestUid: async (input: string): Promise<UidSuggestionsResponse> => {
    const response = await apiClient.post<UidSuggestionsResponse>('/ai/suggest-uid', { input });
    return response.data;
  },

  suggestSearch: async (query: string): Promise<SearchSuggestionsResponse> => {
    const response = await apiClient.post<SearchSuggestionsResponse>('/ai/suggest-search', { query });
    return response.data;
  },

  refineBio: async (name: string, bio: string): Promise<RefinementResponse> => {
    const response = await apiClient.post<RefinementResponse>('/ai/refine-bio', { name, bio });
    return response.data;
  },

  refineMessage: async (text: string): Promise<RefinementResponse> => {
    const response = await apiClient.post<RefinementResponse>('/ai/refine-message', { text });
    return response.data;
  },

  askAssistant: async (question: string): Promise<AssistantResponse> => {
    const response = await apiClient.post<AssistantResponse>('/ai/ask-assistant', { question });
    return response.data;
  },

  coachChat: async (messages: { role: string, content: string }[]): Promise<AssistantResponse> => {
    const response = await apiClient.post<AssistantResponse>('/ai/coach', { messages });
    return response.data;
  }
};