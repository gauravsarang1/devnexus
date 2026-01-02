
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from '../userService';
import apiClient from '../apiClient';

vi.mock('../apiClient');

describe('UserService (Frontend)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProfile should fetch user details by UID', async () => {
    const mockUser = { id: '1', uId: 'aryan_dev', name: 'Aryan' };
    (apiClient.get as any).mockResolvedValue({
      data: { success: true, data: mockUser }
    });

    const result = await userService.getProfile('aryan_dev');

    expect(apiClient.get).toHaveBeenCalledWith('/users/aryan_dev');
    expect(result?.uId).toBe('aryan_dev');
  });

  it('updateProfile should send PUT request with partial user data', async () => {
    const updateData = { name: 'Aryan S', bio: 'New bio' };
    (apiClient.put as any).mockResolvedValue({
      data: { success: true, data: { ...updateData, id: '1' } }
    });

    const result = await userService.updateProfile(updateData as any);

    expect(apiClient.put).toHaveBeenCalledWith('/users/update-profile', updateData);
    expect(result.name).toBe('Aryan S');
  });

  it('getDashboardActivity should fetch summarized user activity', async () => {
    const mockActivity = { hasActivity: true, pendingRequests: 5 };
    (apiClient.get as any).mockResolvedValue({
      data: { success: true, data: mockActivity }
    });

    const result = await userService.getDashboardActivity();

    expect(apiClient.get).toHaveBeenCalledWith('/users/activity');
    expect(result.pendingRequests).toBe(5);
  });
});
