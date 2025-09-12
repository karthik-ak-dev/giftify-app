import { Response, NextFunction } from 'express';
import { getBalanceService } from '../../services/wallet/getBalanceService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';

export const getBalanceHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const balance = await getBalanceService(userId);

    const response: ApiResponse = {
      success: true,
      data: balance,
      message: 'Wallet balance retrieved successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 