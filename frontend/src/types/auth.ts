export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    walletBalance: number;
    accessToken: string;
    refreshToken: string;
    isEmailVerified: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

