import { userRepository } from '../../repositories/userRepository';
import { AppError } from '../../middleware/errorHandler';

export const getProfileService = async (userId: string) => {
  try {
    // Find user by ID
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Return user data without sensitive fields using the User model's toPublic method
    return user.toPublic();
  } catch (error) {
    // Re-throw AppErrors
    if (error instanceof AppError) {
      throw error;
    }

    // Handle repository errors
    if (error instanceof Error && error.message.includes('not found')) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Handle any other unexpected errors
    if (error instanceof Error) {
      throw new AppError(`Failed to get user profile: ${error.message}`, 500, 'PROFILE_FETCH_FAILED');
    }

    throw new AppError('Failed to get user profile', 500, 'PROFILE_FETCH_FAILED');
  }
}; 