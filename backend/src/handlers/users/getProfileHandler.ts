import { Response, NextFunction } from 'express';
import { getProfileService } from '../../services/users/getProfileService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';

export const getProfileHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const profile = await getProfileService(userId);

    const response: ApiResponse = {
      success: true,
      data: profile,
      message: 'Profile retrieved successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 