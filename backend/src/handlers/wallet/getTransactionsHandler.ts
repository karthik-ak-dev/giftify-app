import { Response, NextFunction } from 'express';
import { getTransactionsService } from '../../services/wallet/getTransactionsService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';
import { TransactionType } from '../../models/WalletTransactionModel';

export const getTransactionsHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { page, limit, type } = req.query;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const transactions = await getTransactionsService(userId, {
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
      type: type ? type as TransactionType : undefined
    });

    const response: ApiResponse = {
      success: true,
      data: transactions,
      message: 'Transactions retrieved successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 