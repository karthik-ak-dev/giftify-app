import { userRepository } from '../../repositories/userRepository';
import { UpdateUserRequest } from '../../types/user';
import { AppError } from '../../middleware/errorHandler';

export const updateProfileService = async (userId: string, updateData: UpdateUserRequest) => {
  const user = await userRepository.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Update user profile
  const updatedUser = await userRepository.update(userId, updateData);
  
  return updatedUser;
}; 