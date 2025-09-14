/**
 * Authentication Hook
 * 
 * Custom hook that provides authentication functionality
 * with error handling and loading states
 */

import { useAuthStore } from '../store/authStore';
import type { LoginCredentials, RegisterData, ProfileData, User } from '../types/auth';

/**
 * Auth hook return type
 */
interface UseAuthReturn {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: ProfileData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
}

/**
 * Custom hook for authentication operations
 */
export const useAuth = (): UseAuthReturn => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    login: storeLogin, 
    register: storeRegister, 
    updateProfile: storeUpdateProfile, 
    logout, 
    clearError 
  } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await storeLogin(credentials);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { error?: { message?: string } })?.error?.message || 'Login failed';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const handleRegister = async (userData: RegisterData) => {
    try {
      await storeRegister(userData);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { error?: { message?: string } })?.error?.message || 'Registration failed';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const handleUpdateProfile = async (data: ProfileData) => {
    try {
      await storeUpdateProfile(data);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { error?: { message?: string } })?.error?.message || 'Profile update failed';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    updateProfile: handleUpdateProfile,
    logout,
    clearError
  };
}; 