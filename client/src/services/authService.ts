import apiClient from './apiClient';
import { User } from '../types';
import { BaseApiResponse } from '../utils/apiResponse';
import { unwrap } from '../utils/apiHelper';

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
  login: async (emailORUid: string, password: string): Promise<AuthData> =>
    unwrap(
      await apiClient.post<LoginResponse>('/auth/login', {
        emailORUid,
        password,
      })
    ),

  register: async (data: RegisterPayload): Promise<null> =>
    unwrap(
      await apiClient.post<SimpleResponse>('/auth/register', data)
    ),

  verifyOtp: async (email: string, otp: string): Promise<null> =>
    unwrap(
      await apiClient.post<SimpleResponse>('/auth/verify-email-otp', {
        email,
        otp,
      })
    ),

  me: async (): Promise<User> =>
    unwrap(
      await apiClient.get<MeResponse>('/auth/me')
    ),

  logout: async (): Promise<null> =>
    unwrap(
      await apiClient.post<SimpleResponse>('/auth/logout')
    ),

  delete: async (): Promise<null> =>
    unwrap(
      await apiClient.delete<SimpleResponse>('/auth/delete')
    ),
};
