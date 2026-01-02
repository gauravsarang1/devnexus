
import { describe, it, expect } from 'vitest';
import reducer, { setToken, logout } from '../authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setToken', () => {
    const actual = reducer(initialState, setToken('test-token'));
    expect(actual.token).toBe('test-token');
    expect(actual.isAuthenticated).toBe(true);
  });

  it('should handle logout', () => {
    const loggedInState = {
      ...initialState,
      token: 'some-token',
      isAuthenticated: true,
      user: { id: '1', name: 'Test' } as any,
    };
    const actual = reducer(loggedInState, logout());
    expect(actual.token).toBe(null);
    expect(actual.user).toBe(null);
    expect(actual.isAuthenticated).toBe(false);
  });
});
