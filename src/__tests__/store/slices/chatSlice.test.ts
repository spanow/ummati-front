import { describe, it, expect } from 'vitest';
import chatReducer, {
  setActiveChat,
  sendMessage,
  markMessageAsRead,
  clearChat,
} from '../../../store/slices/chatSlice';

describe('chatSlice', () => {
  const initialState = {
    messages: [],
    activeChat: null,
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(chatReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setActiveChat', () => {
    const actual = chatReducer(initialState, setActiveChat('chat1'));
    expect(actual.activeChat).toEqual('chat1');
  });

  it('should handle sendMessage', () => {
    const message = {
      id: 'msg1',
      senderId: 'user1',
      receiverId: 'user2',
      content: 'Hello',
      timestamp: '2025-01-01T00:00:00.000Z',
      read: false,
    };

    const actual = chatReducer(initialState, sendMessage(message));
    expect(actual.messages).toHaveLength(1);
    expect(actual.messages[0]).toEqual(message);
  });

  it('should handle markMessageAsRead', () => {
    const state = {
      ...initialState,
      messages: [{
        id: 'msg1',
        senderId: 'user1',
        receiverId: 'user2',
        content: 'Hello',
        timestamp: '2025-01-01T00:00:00.000Z',
        read: false,
      }],
    };

    const actual = chatReducer(state, markMessageAsRead('msg1'));
    expect(actual.messages[0].read).toBe(true);
  });

  it('should handle clearChat', () => {
    const state = {
      ...initialState,
      messages: [{
        id: 'msg1',
        senderId: 'user1',
        receiverId: 'user2',
        content: 'Hello',
        timestamp: '2025-01-01T00:00:00.000Z',
        read: false,
      }],
      activeChat: 'chat1',
    };

    const actual = chatReducer(state, clearChat());
    expect(actual.messages).toHaveLength(0);
    expect(actual.activeChat).toBeNull();
  });
});