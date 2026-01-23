import apiClient from './apiClient';
import { BaseApiResponse } from '../utils/apiResponse';
import { unwrap } from '../utils/apiHelper';

export type UidSuggestionsResponse = BaseApiResponse<string[]>;
export type SearchSuggestionsResponse = BaseApiResponse<string[]>;
export type RefinementResponse = BaseApiResponse<{ refined: string }>;
export type AssistantResponse = BaseApiResponse<{ answer: string }>;

export const aiService = {
  suggestUid: async (input: string): Promise<string[]> =>
    unwrap(
      await apiClient.post<UidSuggestionsResponse>(
        '/ai/suggest-uid',
        { input }
      )
    ),

  suggestSearch: async (query: string): Promise<string[]> =>
    unwrap(
      await apiClient.post<SearchSuggestionsResponse>(
        '/ai/suggest-search',
        { query }
      )
    ),

  refineBio: async (name: string, bio: string): Promise<string> => {
    const { refined } = unwrap(
      await apiClient.post<RefinementResponse>(
        '/ai/refine-bio',
        { name, bio }
      )
    );
    return refined;
  },

  refineMessage: async (text: string): Promise<string> => {
    const { refined } = unwrap(
      await apiClient.post<RefinementResponse>(
        '/ai/refine-message',
        { text }
      )
    );
    return refined;
  },

  askAssistant: async (question: string): Promise<string> => {
    const { answer } = unwrap(
      await apiClient.post<AssistantResponse>(
        '/ai/ask-assistant',
        { question }
      )
    );
    return answer;
  },

  coachChat: async (
    messages: { role: string; content: string }[]
  ): Promise<string> => {
    const { answer } = unwrap(
      await apiClient.post<AssistantResponse>(
        '/ai/coach',
        { messages }
      )
    );
    return answer;
  },
};
