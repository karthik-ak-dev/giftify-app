import { Request, Response, NextFunction } from 'express';
import { refreshService } from '../../services/auth/refreshService';
import { ApiResponse } from '../../types/api';

export const refreshHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshService(refreshToken);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Token refreshed successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 