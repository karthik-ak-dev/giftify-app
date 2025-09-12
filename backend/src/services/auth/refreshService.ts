import { userRepository } from '../../repositories/userRepository';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';

export const refreshService = async (refreshToken: string) => {
  try {
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);
    
    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 401, 'INVALID_TOKEN_TYPE');
    }

    // Verify user still exists and is active
    const user = await userRepository.findById(decoded.userId);
    if (!user || user.status !== 'ACTIVE') {
      throw new AppError('User not found or inactive', 401, 'USER_NOT_FOUND');
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user.userId, user.email);
    const newRefreshToken = generateRefreshToken(user.userId, user.email);

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }
}; 