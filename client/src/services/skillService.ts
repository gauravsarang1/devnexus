import apiClient from './apiClient';
import { Skill, SkillLevel, SkillRole } from '../types';
import { BaseApiResponse, PaginatedResponse } from '../utils/apiResponse';
import { unwrap } from '../utils/apiHelper';

export type SkillsPaginatedResponse =
  PaginatedResponse<Skill, 'skills'>;

export type SkillResponse = BaseApiResponse<Skill>;
export type SimpleSkillActionResponse = BaseApiResponse<null>;

export const skillService = {
  getAllSkills: async (
    page = 1,
    limit = 20
  ): Promise<SkillsPaginatedResponse['data']> => {
    const res = await apiClient.get<SkillsPaginatedResponse>(
      `/skills?page=${page}&limit=${limit}`
    );
    return res.data.data;
  },

  getSkillById: async (id: string): Promise<Skill> =>
    unwrap(
      await apiClient.get<SkillResponse>(`/skills/${id}`)
    ),

  addUserSkill: async (skillData: {
    skillId?: string;
    skillName?: string;
    role: SkillRole;
    level: SkillLevel;
  }): Promise<null> =>
    unwrap(
      await apiClient.post<SimpleSkillActionResponse>(
        '/skillOnUser',
        skillData
      )
    ),

  updateUserSkill: async (
    skillOnUserId: string,
    level: SkillLevel
  ): Promise<null> =>
    unwrap(
      await apiClient.put<SimpleSkillActionResponse>(
        `/skillOnUser/${skillOnUserId}`,
        { level }
      )
    ),

  removeUserSkill: async (skillOnUserId: string): Promise<null> =>
    unwrap(
      await apiClient.delete<SimpleSkillActionResponse>(
        `/skillOnUser/${skillOnUserId}`)
    ),
};
