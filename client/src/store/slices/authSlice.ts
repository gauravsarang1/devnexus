import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { authService } from '../../../services/authService';
import apiClient from '../../../services/apiClient';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null, // In-memory only
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// New thunk to refresh access token using the HttpOnly cookie
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      // Direct call to avoid circular dependency if using authService
      const response = await apiClient.post('/auth/refresh');
      if (response.data.success) {
        return response.data.data.accessToken;
      }
      return rejectWithValue('Refresh failed');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Session expired');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.me();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      // Handle Refresh Token cases
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;