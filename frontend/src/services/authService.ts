import { API_CONFIG, getApiUrl } from '../config/api';
import { 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse, 
  RefreshTokenResponse 
} from '../types/auth';

// Token storage keys
const ACCESS_TOKEN_KEY = 'giftify_access_token';
const REFRESH_TOKEN_KEY = 'giftify_refresh_token';

// Token management
export const tokenService = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// API service
export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      // Extract detailed error message from nested error field (handle both string and object)
      let errorMessage = error.message || 'Registration failed';
      
      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (typeof error.error === 'object' && error.error.message) {
          errorMessage = error.error.message;
        }
      }
      
      throw new Error(errorMessage);
    }

    const result: AuthResponse = await response.json();
    
    // Store tokens
    if (result.success && result.data.accessToken && result.data.refreshToken) {
      tokenService.setTokens(result.data.accessToken, result.data.refreshToken);
    }

    return result;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      // Extract detailed error message from nested error field (handle both string and object)
      let errorMessage = error.message || 'Login failed';
      
      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (typeof error.error === 'object' && error.error.message) {
          errorMessage = error.error.message;
        }
      }
      
      throw new Error(errorMessage);
    }

    const result: AuthResponse = await response.json();
    
    // Store tokens
    if (result.success && result.data.accessToken && result.data.refreshToken) {
      tokenService.setTokens(result.data.accessToken, result.data.refreshToken);
    }

    return result;
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const refreshToken = tokenService.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      tokenService.clearTokens();
      throw new Error('Token refresh failed');
    }

    const result: RefreshTokenResponse = await response.json();
    
    // Update tokens
    if (result.success && result.data.tokens) {
      tokenService.setTokens(result.data.tokens.accessToken, result.data.tokens.refreshToken);
    }

    return result;
  },

  logout: (): void => {
    tokenService.clearTokens();
  },
};

