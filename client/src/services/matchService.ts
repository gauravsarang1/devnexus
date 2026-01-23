import apiClient from './apiClient';
import { Match, MatchStatus } from '../types';
import { BaseApiResponse, PaginatedResponse } from '../utils/apiResponse';
import { unwrap } from '../utils/apiHelper';

export type MatchPaginatedResponse = PaginatedResponse<Match, 'matches'>;
export type MatchResponse = BaseApiResponse<Match>;
export type MutualSkillsResponse = BaseApiResponse<any[]>;

export const matchService = {
  getMatches: async (
    tab: 'Incoming' | 'Sent' | 'Active',
    page = 1,
    limit = 10
  ): Promise<MatchPaginatedResponse['data']> => {
    const res = await apiClient.get<MatchPaginatedResponse>(
      `/matches?type=${tab.toLowerCase()}&page=${page}&limit=${limit}`
    );
    return res.data.data;
  },

  sendRequest: async (targetUserId: string): Promise<Match> =>
    unwrap(
      await apiClient.post<MatchResponse>('/matches', {
        targetUserId,
      })
    ),

  updateStatus: async (
    matchId: string,
    status: MatchStatus
  ): Promise<Match> =>
    unwrap(
      await apiClient.put<MatchResponse>(
        `/matches/${matchId}/status`,
        { status }
      )
    ),

  getMutualSkills: async (otherUserId: string): Promise<any[]> =>
    unwrap(
      await apiClient.get<MutualSkillsResponse>(
        `/users/mutual-skills/${otherUserId}`
      )
    ) ?? [],
};
