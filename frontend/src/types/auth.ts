/**
 * Authentication Types
 * Based on backend UserModel and auth types
 */

// User Status from backend UserModel
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

// User interface matching backend User model
export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  status: UserStatus;
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// Login request
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register request matching backend CreateUserRequest
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Update profile matching backend UpdateUserRequest
export interface ProfileData {
  firstName?: string;
  lastName?: string;
}

// Auth tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

// Auth response
export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    tokens: AuthTokens;
  };
  message: string;
  timestamp: string;
} 