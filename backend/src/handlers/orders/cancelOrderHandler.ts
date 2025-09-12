import { Response, NextFunction } from 'express';
import { cancelOrderService } from '../../services/orders/cancelOrderService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';

export const cancelOrderHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { orderId } = req.params;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const result = await cancelOrderService(orderId, userId);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Order cancelled successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 