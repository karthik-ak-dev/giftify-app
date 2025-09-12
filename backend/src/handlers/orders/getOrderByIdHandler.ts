import { Response, NextFunction } from 'express';
import { getOrderByIdService } from '../../services/orders/getOrderByIdService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';

export const getOrderByIdHandler = async (
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

    const order = await getOrderByIdService(orderId, userId);

    const response: ApiResponse = {
      success: true,
      data: order,
      message: 'Order retrieved successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 