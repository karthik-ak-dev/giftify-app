import { Response, NextFunction } from 'express';
import { manageCartService } from '../../services/cart/manageCartService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';
import { AppError } from '../../middleware/errorHandler';

export const manageCartHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { variantId, quantity } = req.body;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    if (!variantId) {
      throw new AppError('Variant ID is required', 400, 'VALIDATION_ERROR');
    }

    if (quantity === undefined || quantity < 0) {
      throw new AppError('Valid quantity is required', 400, 'VALIDATION_ERROR');
    }

    const result = await manageCartService(userId, variantId, quantity);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Cart updated successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 