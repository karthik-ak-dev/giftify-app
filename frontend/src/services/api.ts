import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';
import type { ApiResponse, ApiError } from '../types/api';

interface QueueItem {
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * API Client Configuration
 */
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: QueueItem[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh and error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableAxiosRequestConfig;

        if (!originalRequest) {
          return Promise.reject(this.handleError(error));
        }

        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return this.client(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.client.post(API_ENDPOINTS.REFRESH, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
            
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

            // Process queued requests
            this.failedQueue.forEach(({ resolve }) => resolve(accessToken));
            this.failedQueue = [];

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            this.clearAuthTokens();
            this.failedQueue.forEach(({ reject }) => reject(refreshError));
            this.failedQueue = [];
            
            // Redirect to login page
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle API errors and convert to standardized format
   */
  private handleError(error: AxiosError): ApiError {
    if (error.response?.data) {
      // Server responded with error
      return error.response.data as ApiError;
    }

    if (error.code === 'ECONNABORTED') {
      // Request timeout
      return {
        success: false,
        error: {
          code: 'TIMEOUT',
          message: 'Request timed out. Please try again.',
        },
        timestamp: new Date().toISOString(),
      };
    }

    if (!error.response) {
      // Network error
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: ERROR_MESSAGES.NETWORK_ERROR,
        },
        timestamp: new Date().toISOString(),
      };
    }

    // Generic server error
    const status = error.response.status;
    let message: string = ERROR_MESSAGES.GENERIC_ERROR;

    switch (status) {
      case 400:
        message = ERROR_MESSAGES.VALIDATION_ERROR;
        break;
      case 401:
        message = ERROR_MESSAGES.UNAUTHORIZED;
        break;
      case 403:
        message = ERROR_MESSAGES.FORBIDDEN;
        break;
      case 404:
        message = ERROR_MESSAGES.NOT_FOUND;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        message = ERROR_MESSAGES.SERVER_ERROR;
        break;
    }

    return {
      success: false,
      error: {
        code: `HTTP_${status}`,
        message,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Clear authentication tokens
   */
  private clearAuthTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * GET request
   */
  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.patch(url, data);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient(); 