import { userRepository } from '../../repositories/userRepository';
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
  if (user.status !== 'ACTIVE') {
    throw new AppError('Account is suspended or deleted', 401, 'ACCOUNT_SUSPENDED');
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Update last login
  await userRepository.updateLastLogin(user.userId);

  // Generate tokens
  const accessToken = generateAccessToken(user.userId, user.email);
  const refreshToken = generateRefreshToken(user.userId, user.email);

  return {
    userId: user.userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    walletBalance: user.walletBalance,
    accessToken,
    refreshToken
  };
}; 