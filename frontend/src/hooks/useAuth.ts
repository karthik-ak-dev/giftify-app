import { useAuthStore } from '../store/authStore';
import type { LoginCredentials, RegisterData, ProfileData } from '../types/auth';

/**
 * Custom hook for authentication operations
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.error?.message || 'Login failed' 
      };
    }
  };

  const handleRegister = async (userData: RegisterData) => {
    try {
      await register(userData);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.error?.message || 'Registration failed' 
      };
    }
  };

  const handleUpdateProfile = async (data: ProfileData) => {
    try {
      await updateProfile(data);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.error?.message || 'Profile update failed' 
      };
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login: handleLogin,
    register: handleRegister,
    logout,
    updateProfile: handleUpdateProfile,
    clearError,
    
    // Computed values
    userInitials: user ? `${user.firstName[0]}${user.lastName[0]}` : '',
    userFullName: user ? `${user.firstName} ${user.lastName}` : '',
  };
}; 