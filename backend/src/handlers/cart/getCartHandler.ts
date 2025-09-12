import { Response, NextFunction } from 'express';
import { getCartService } from '../../services/cart/getCartService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';

export const getCartHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const cart = await getCartService(userId);

    const response: ApiResponse = {
      success: true,
      data: cart,
      message: 'Cart retrieved successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 