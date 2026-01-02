
import apiClient from './apiClient';
import { Match, MatchStatus } from '../src/types';
import { BaseApiResponse, PaginatedResponse } from '../src/utils/apiResponse';

export type MatchPaginatedResponse = PaginatedResponse<Match, 'matches'>;
export type MatchResponse = BaseApiResponse<Match>;
export type MutualSkillsResponse = BaseApiResponse<any[]>;

export const matchService = {
  getMatches: async (tab: 'Incoming' | 'Sent' | 'Active', page = 1, limit = 10): Promise<MatchPaginatedResponse['data']> => {
    const response = await apiClient.get<MatchPaginatedResponse>(`/matches?type=${tab.toLowerCase()}&page=${page}&limit=${limit}`);
    return response.data.data;
  },

  sendRequest: async (targetUserId: string): Promise<Match> => {
    const response = await apiClient.post<MatchResponse>('/matches', { targetUserId });
    return response.data.data;
  },

  updateStatus: async (matchId: string, status: MatchStatus): Promise<Match> => {
    const response = await apiClient.put<MatchResponse>(`/matches/${matchId}/status`, { status });
    return response.data.data;
  },

  getMutualSkills: async (otherUserId: string): Promise<any[]> => {
    const response = await apiClient.get<MutualSkillsResponse>(`/users/mutual-skills/${otherUserId}`);
    return response.data.data || [];
  }
};
