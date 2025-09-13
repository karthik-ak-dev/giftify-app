import { Response, NextFunction } from 'express';
import { getOrdersService } from '../../services/orders/getOrdersService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';

export const getOrdersHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { page, limit } = req.query;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const orders = await getOrdersService(
      userId,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 10
    );

    const response: ApiResponse = {
      success: true,
      data: orders,
      message: 'Orders retrieved successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 