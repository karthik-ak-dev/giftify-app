import { Response, NextFunction } from 'express';
import { clearCartService } from '../../services/cart/clearCartService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';

export const clearCartHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    await clearCartService(userId);

    const response: ApiResponse = {
      success: true,
      message: 'Cart cleared successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 