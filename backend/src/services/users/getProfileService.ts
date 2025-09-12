import { userRepository } from '../../repositories/userRepository';
import { UserModel } from '../../models/UserModel';
import { AppError } from '../../middleware/errorHandler';

export const getProfileService = async (userId: string) => {
  const user = await userRepository.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return UserModel.toUser(user);
}; 