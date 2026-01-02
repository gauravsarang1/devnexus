
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCurrentUser, refreshAccessToken } from '../authSlice';
import { authService } from '../../../../services/authService';
import apiClient from '../../../../services/apiClient';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../authSlice';

vi.mock('../../../../services/authService');
vi.mock('../../../../services/apiClient');

describe('authSlice thunks', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({ reducer: { auth: authReducer } });
    vi.clearAllMocks();
  });

  it('fetchCurrentUser should update state on success', async () => {
    const mockUser = { id: '1', name: 'Test' };
    (authService.me as any).mockResolvedValue({ success: true, data: mockUser });

    await store.dispatch(fetchCurrentUser());
    
    expect(store.getState().auth.user).toEqual(mockUser);
    expect(store.getState().auth.isAuthenticated).toBe(true);
  });

  it('refreshAccessToken should set token on success', async () => {
    (apiClient.post as any).mockResolvedValue({ 
      data: { success: true, data: { accessToken: 'new-token' } } 
    });

    await store.dispatch(refreshAccessToken());
    
    expect(store.getState().auth.token).toBe('new-token');
  });
});
