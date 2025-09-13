import { userRepository } from '../../repositories/userRepository';
import { UserStatus } from '../../models/UserModel';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';

export const refreshService = async (refreshToken: string) => {
  try {
    // Verify and decode the refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);
    
    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 401, 'INVALID_TOKEN_TYPE');
    }

    // Verify user still exists and is active
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found', 401, 'USER_NOT_FOUND');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError('User account is inactive', 401, 'USER_INACTIVE');
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user.userId, user.email);
    const newRefreshToken = generateRefreshToken(user.userId, user.email);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: user.toPublic() // Include user data for client state updates
    };
  } catch (error) {
    // If it's already an AppError, re-throw it
    if (error instanceof AppError) {
      throw error;
    }
    
    // For any other error (JWT verification, etc.), throw invalid token error
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }
}; 