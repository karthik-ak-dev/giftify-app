import { API_CONFIG, getApiUrl } from '../config/api';
import { tokenService } from './authService';

// Types
export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  walletBalance: number;
  isEmailVerified: boolean;
  status: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}

/**
 * Fetch user profile from backend
 */
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const accessToken = tokenService.getAccessToken();
  
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USERS.PROFILE), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch user profile');
  }

  const result: UserProfileResponse = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error('Invalid response from server');
  }

  return result.data;
};

