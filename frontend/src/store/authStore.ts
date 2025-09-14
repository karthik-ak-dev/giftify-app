import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../services/api';
import { API_ENDPOINTS, STORAGE_KEYS, SUCCESS_MESSAGES } from '../utils/constants';
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  ProfileData,
  AuthState,
  AuthActions 
} from '../types/auth';

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.LOGIN,
            credentials
          );

          const { user, tokens } = response.data!;
          
          // Store tokens in localStorage
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
          
          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Show success message (you can integrate with a toast library here)
          console.log(SUCCESS_MESSAGES.LOGIN_SUCCESS);
        } catch (error: unknown) {
          const errorMessage = error && typeof error === 'object' && 'error' in error 
            ? (error as { error?: { message?: string } }).error?.message || 'Login failed'
            : 'Login failed';
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.REGISTER,
            userData
          );

          const { user, tokens } = response.data!;
          
          // Store tokens in localStorage
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
          
          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Show success message
          console.log(SUCCESS_MESSAGES.REGISTER_SUCCESS);
        } catch (error: unknown) {
          const errorMessage = error && typeof error === 'object' && 'error' in error 
            ? (error as { error?: { message?: string } }).error?.message || 'Registration failed'
            : 'Registration failed';
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.CART_DATA);
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        // Show success message
        console.log(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          get().logout();
          throw new Error('No refresh token available');
        }

        try {
          const response = await apiClient.post<{ data: { tokens: { accessToken: string; refreshToken: string } } }>(
            API_ENDPOINTS.REFRESH,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data!.data.tokens;
          
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          
          set({
            accessToken,
            refreshToken: newRefreshToken,
          });
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      updateProfile: async (data: ProfileData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.put<User>(
            API_ENDPOINTS.PROFILE,
            data
          );

          const updatedUser = response.data!;
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });

          // Show success message
          console.log(SUCCESS_MESSAGES.PROFILE_UPDATED);
        } catch (error: unknown) {
          const errorMessage = error && typeof error === 'object' && 'error' in error 
            ? (error as { error?: { message?: string } }).error?.message || 'Profile update failed'
            : 'Profile update failed';
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 