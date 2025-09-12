import { Request, Response, NextFunction } from 'express';
import { loginService } from '../../services/auth/loginService';
import { ApiResponse } from '../../types/api';

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

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