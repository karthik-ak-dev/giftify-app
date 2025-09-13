import { userRepository } from '../../repositories/userRepository';
import { User, UserStatus } from '../../models/UserModel';
import { comparePassword } from '../../utils/crypto';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';

export const loginService = async (email: string, password: string) => {
  // Find user by email
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Check if user is active
  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError('Account is suspended or deleted', 401, 'ACCOUNT_SUSPENDED');
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Update last login using the User instance
  const updatedUser = await userRepository.updateLastLogin(user);

  // Generate tokens
  const accessToken = generateAccessToken(updatedUser.userId, updatedUser.email);
  const refreshToken = generateRefreshToken(updatedUser.userId, updatedUser.email);

  // Return user data without sensitive fields
  const publicUserData = updatedUser.toPublic();

  return {
    ...publicUserData,
    accessToken,
    refreshToken
  };
}; 