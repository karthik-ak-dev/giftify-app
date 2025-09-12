import { Response, NextFunction } from 'express';
import { updateProfileService } from '../../services/users/updateProfileService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';

export const updateProfileHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const updateData = req.body;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const updatedProfile = await updateProfileService(userId, updateData);

    const response: ApiResponse = {
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 