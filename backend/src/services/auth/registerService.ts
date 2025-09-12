import { userRepository } from '../../repositories/userRepository';
import { CreateUserRequest } from '../../types/user';
import { hashPassword } from '../../utils/crypto';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import { APP_CONSTANTS } from '../../config/constants';
import { ulid } from 'ulid';

export const registerService = async (userData: CreateUserRequest) => {
  // Check if user already exists
  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    throw new AppError('User already exists with this email', APP_CONSTANTS.HTTP_STATUS.BAD_REQUEST, APP_CONSTANTS.ERROR_CODES.USER_EXISTS);
  }

  // Hash password
  const passwordHash = await hashPassword(userData.password);

  // Create user
  const userId = ulid();
  const now = new Date().toISOString();
  
  await userRepository.create({
    userId,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phoneNumber: userData.phoneNumber,
    passwordHash,
    isEmailVerified: false,
    isPhoneVerified: false,
    status: APP_CONSTANTS.USER_STATUS.ACTIVE,
    walletBalance: 0,
    createdAt: now,
    updatedAt: now
  });

  // Generate tokens
  const accessToken = generateAccessToken(userId, userData.email);
  const refreshToken = generateRefreshToken(userId, userData.email);

  return {
    userId,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    accessToken,
    refreshToken
  };
}; 