import { userRepository } from '../../repositories/userRepository';
import { User, UserStatus } from '../../models/UserModel';
import { CreateUserRequest } from '../../types/user';
import { hashPassword } from '../../utils/crypto';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';

export const registerService = async (userData: CreateUserRequest) => {
  try {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('User already exists with this email', 400, 'USER_EXISTS');
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user instance using the User model
    const newUser = User.create({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      passwordHash
    });

    // Save user to database
    const createdUser = await userRepository.create(newUser);

    // Generate tokens
    const accessToken = generateAccessToken(createdUser.userId, createdUser.email);
    const refreshToken = generateRefreshToken(createdUser.userId, createdUser.email);

    // Return user data without sensitive fields
    const publicUserData = createdUser.toPublic();

    return {
      ...publicUserData,
      accessToken,
      refreshToken
    };
  } catch (error) {
    // If it's already an AppError, re-throw it
    if (error instanceof AppError) {
      throw error;
    }

    // Handle DynamoDB conditional check failures (duplicate user/email)
    if (error instanceof Error && error.message.includes('already exists')) {
      throw new AppError('User already exists with this email', 400, 'USER_EXISTS');
    }

    // Handle validation errors from User model
    if (error instanceof Error && (
      error.message.includes('required') || 
      error.message.includes('Invalid email') ||
      error.message.includes('cannot be empty') ||
      error.message.includes('cannot exceed')
    )) {
      throw new AppError(`Validation error: ${error.message}`, 400, 'VALIDATION_ERROR');
    }

    // For any other unexpected error
    throw new AppError('Registration failed', 500, 'REGISTRATION_FAILED');
  }
}; 