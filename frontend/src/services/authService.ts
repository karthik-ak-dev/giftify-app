import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  ProfileData,
  User,
  AuthTokens
} from '../types/auth';

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data!;
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.REGISTER,
      userData
    );
    return response.data!;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiClient.post<{ tokens: AuthTokens }>(
      API_ENDPOINTS.REFRESH,
      { refreshToken }
    );
    return response.data!.tokens;
  },

  /**
   * Get user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>(API_ENDPOINTS.PROFILE);
    return response.data!;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: ProfileData): Promise<User> => {
    const response = await apiClient.put<User>(API_ENDPOINTS.PROFILE, data);
    return response.data!;
  },
}; 