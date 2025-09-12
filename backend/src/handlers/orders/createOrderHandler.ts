import { Response, NextFunction } from 'express';
import { createOrderService } from '../../services/orders/createOrderService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';
import { AppError } from '../../middleware/errorHandler';

export const createOrderHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { items } = req.body;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError('Order items are required', 400, 'VALIDATION_ERROR');
    }

    const order = await createOrderService(userId, items);

    const response: ApiResponse = {
      success: true,
      data: order,
      message: 'Order created successfully',
      timestamp: new Date().toISOString()
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}; 