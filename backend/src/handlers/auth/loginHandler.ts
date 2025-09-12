import { Request, Response, NextFunction } from 'express';
import { loginService } from '../../services/auth/loginService';
import { ApiResponse } from '../../types/api';
import { AppError } from '../../middleware/errorHandler';

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // TODO: Add validation
    if (!email || !password) {
      throw new AppError('Email and password are required', 400, 'VALIDATION_ERROR');
    }

    const result = await loginService(email, password);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Login successful',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 