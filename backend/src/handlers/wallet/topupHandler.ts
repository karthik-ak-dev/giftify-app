import { Response, NextFunction } from 'express';
import { topupService } from '../../services/wallet/topupService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';

export const topupHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { amount, description } = req.body;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const result = await topupService(userId, amount, description);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Wallet topped up successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 