import { userRepository } from '../../repositories/userRepository';
import { UpdateUserRequest } from '../../types/user';
import { AppError } from '../../middleware/errorHandler';

export const updateProfileService = async (userId: string, updateData: UpdateUserRequest) => {
  try {
    // Find user by ID
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Validate update data
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new AppError('No update data provided', 400, 'NO_UPDATE_DATA');
    }

    // Check if there are any valid fields to update
    const validFields = ['firstName', 'lastName'];
    const hasValidFields = Object.keys(updateData).some(key => 
      validFields.includes(key) && updateData[key as keyof UpdateUserRequest] !== undefined
    );

    if (!hasValidFields) {
      throw new AppError('No valid fields provided for update', 400, 'INVALID_UPDATE_FIELDS');
    }

    // Update user using the User model's update method
    user.update({
      firstName: updateData.firstName,
      lastName: updateData.lastName
    });

    // Save the updated user
    const updatedUser = await userRepository.save(user);

    // Return user data without sensitive fields
    return updatedUser.toPublic();
  } catch (error) {
    // Re-throw AppErrors
    if (error instanceof AppError) {
      throw error;
    }

    // Handle User model validation errors
    if (error instanceof Error && (
      error.message.includes('cannot be empty') ||
      error.message.includes('cannot exceed') ||
      error.message.includes('required')
    )) {
      throw new AppError(`Validation error: ${error.message}`, 400, 'VALIDATION_ERROR');
    }

    // Handle repository errors
    if (error instanceof Error && error.message.includes('not found')) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Handle any other unexpected errors
    if (error instanceof Error) {
      throw new AppError(`Failed to update user profile: ${error.message}`, 500, 'PROFILE_UPDATE_FAILED');
    }

    throw new AppError('Failed to update user profile', 500, 'PROFILE_UPDATE_FAILED');
  }
}; 