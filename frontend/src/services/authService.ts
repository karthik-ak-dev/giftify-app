/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { LoginCredentials, RegisterData, AuthResponse, ProfileData, User } from '../types/auth';

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.REGISTER,
      userData
    );
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  /**
   * Refresh access token
   */
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.REFRESH,
      { refreshToken }
    );
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    const response = await apiClient.post(API_ENDPOINTS.LOGOUT);
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: ProfileData): Promise<User> => {
    const response = await apiClient.put<{ user: User }>(
      API_ENDPOINTS.UPDATE_PROFILE,
      profileData
    );
    
    if (!response.data?.user) {
      throw new Error('Invalid response from server');
    }
    
    return response.data.user;
  }
}; 