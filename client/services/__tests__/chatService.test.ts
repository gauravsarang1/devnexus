
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chatService } from '../chatService';
import apiClient from '../apiClient';

vi.mock('../apiClient');

describe('ChatService (Frontend)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getChats should fetch a paginated list of conversations', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          chats: [{ id: 'chat1', updatedAt: '2024-01-01' }],
          pagination: { total: 1, page: 1, limit: 15, hasNextPage: false }
        }
      }
    };
    (apiClient.get as any).mockResolvedValue(mockResponse);

    const result = await chatService.getChats(1, 15);

    expect(apiClient.get).toHaveBeenCalledWith('/chats?page=1&limit=15');
    expect(result.chats).toHaveLength(1);
    expect(result.chats[0].id).toBe('chat1');
  });

  it('sendMessage should post a new message and return the created object', async () => {
    const mockMsg = { id: 'm1', text: 'Hello', chatId: 'c1', senderId: 'u1' };
    (apiClient.post as any).mockResolvedValue({
      data: { success: true, data: mockMsg }
    });

    const result = await chatService.sendMessage('c1', 'Hello');

    expect(apiClient.post).toHaveBeenCalledWith('/messages', { chatId: 'c1', text: 'Hello' });
    expect(result.text).toBe('Hello');
  });

  it('markChatAsSeen should trigger the seen endpoint', async () => {
    (apiClient.post as any).mockResolvedValue({ data: { success: true } });
    
    const result = await chatService.markChatAsSeen('c1');
    
    expect(apiClient.post).toHaveBeenCalledWith('/messages/chat/c1/seen');
    expect(result.success).toBe(true);
  });
});
