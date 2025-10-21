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

