
import apiClient from './apiClient';
import { Skill, SkillLevel, SkillRole } from '../types';
import { BaseApiResponse, PaginatedResponse } from '../utils/apiResponse';

export type SkillsPaginatedResponse = PaginatedResponse<Skill, 'skills'>;
export type SkillResponse = BaseApiResponse<Skill>;
export type SimpleSkillActionResponse = BaseApiResponse<any>;

export const skillService = {
  getAllSkills: async (page = 1, limit = 20): Promise<SkillsPaginatedResponse['data']> => {
    const response = await apiClient.get<SkillsPaginatedResponse>(`/skills?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  getSkillById: async (id: string): Promise<Skill> => {
    const response = await apiClient.get<SkillResponse>(`/skills/${id}`);
    return response.data.data;
  },

  addUserSkill: async (skillData: { 
    skillId?: string, 
    skillName?: string, 
    role: SkillRole, 
    level: SkillLevel 
  }): Promise<SimpleSkillActionResponse> => {
    const response = await apiClient.post<SimpleSkillActionResponse>('/skill-on-user', skillData);
    return response.data;
  },

  updateUserSkill: async (skillOnUserId: string, level: SkillLevel): Promise<SimpleSkillActionResponse> => {
    const response = await apiClient.put<SimpleSkillActionResponse>(`/skill-on-user/${skillOnUserId}`, { level });
    return response.data;
  },

  removeUserSkill: async (skillOnUserId: string): Promise<SimpleSkillActionResponse> => {
    const response = await apiClient.delete<SimpleSkillActionResponse>(`/skill-on-user/${skillOnUserId}`);
    return response.data;
  }
};
