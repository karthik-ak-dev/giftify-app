/**
 * Authentication Store
 * 
 * Zustand store for managing authentication state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import type { User, LoginCredentials, RegisterData, ProfileData } from '../types/auth';

/**
 * Storage keys for localStorage
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'giftify_access_token',
  REFRESH_TOKEN: 'giftify_refresh_token',
  USER: 'giftify_user'
} as const;

/**
 * Authentication Store State
 */
export interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileData) => Promise<void>;
  clearError: () => void;
  checkAuth: () => void;
  refreshToken: () => Promise<boolean>;
  
  // Computed
  userFullName: string;
}

/**
 * Create authentication store
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.login(credentials);
          
          if (!response.data) {
            throw new Error('Invalid response from server');
          }

          const { user, tokens } = response.data;
          
          if (!user || !tokens) {
            throw new Error('Invalid authentication data');
          }
          
          // Store tokens in localStorage
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.register(userData);
          
          if (!response.data) {
            throw new Error('Invalid response from server');
          }

          const { user, tokens } = response.data;
          
          if (!user || !tokens) {
            throw new Error('Invalid registration data');
          }
          
          // Store tokens in localStorage
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      logout: () => {
        // Clear tokens from localStorage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Reset state
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
        
        // Call logout API (fire and forget)
        authService.logout().catch(console.error);
      },

      updateProfile: async (data: ProfileData) => {
        set({ isLoading: true, error: null });
        
        try {
          const updatedUser = await authService.updateProfile(data);
          
          if (!updatedUser) {
            throw new Error('Invalid response from server');
          }
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
          set({
            isLoading: false,
            error: errorMessage
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (accessToken && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            set({
              user,
              isAuthenticated: true
            });
          } catch (error) {
            console.error('Failed to parse stored user:', error);
            get().logout();
          }
        }
      },

      refreshToken: async (): Promise<boolean> => {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (!refreshToken) {
          get().logout();
          return false;
        }
        
        try {
          const response = await authService.refresh(refreshToken);
          
          if (!response.data?.tokens) {
            throw new Error('Invalid refresh response');
          }

          const { tokens } = response.data;
          
          // Update tokens in localStorage
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
          
          return true;
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
          return false;
        }
      },

      // Computed properties
      get userFullName() {
        const { user } = get();
        return user ? `${user.firstName} ${user.lastName}` : '';
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
); 