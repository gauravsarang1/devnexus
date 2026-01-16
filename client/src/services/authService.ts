import apiClient from './apiClient';
import { User } from '../types';
import { BaseApiResponse } from '../utils/apiResponse';

export interface AuthData {
  accessToken: string;
}

export interface RegisterPayload {
  name: string;
  uId: string;
  email: string;
  password: string;
  offeredSkills?: string[];
  seekingSkills?: string[];
}

export type LoginResponse = BaseApiResponse<AuthData>;
export type MeResponse = BaseApiResponse<User>;
export type SimpleResponse = BaseApiResponse<null>;

export const authService = {
  login: async (emailORUid: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', { emailORUid, password });
    return response.data;
  },

  register: async (data: RegisterPayload): Promise<SimpleResponse> => {
    const response = await apiClient.post<SimpleResponse>('/auth/register', data);
        console.log("Register response:", response.data);

    return response.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<SimpleResponse> => {
    const response = await apiClient.post<SimpleResponse>('/auth/verify-email-otp', { email, otp });
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error("Logout failed", err);
    }
  },

  delete: async (): Promise<SimpleResponse> => {
    try {
      const response = await apiClient.delete<SimpleResponse>('/auth/delete');
      return response.data;
    } catch (error) {
      console.error("Account deletion failed", error);
    }
  }
};
