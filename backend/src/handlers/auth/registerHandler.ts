import { Request, Response, NextFunction } from 'express';
import { registerService } from '../../services/auth/registerService';
import { ApiResponse } from '../../types/api';
import { AppError } from '../../middleware/errorHandler';

export const registerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    // TODO: Add validation
    if (!email || !password || !firstName || !lastName) {
      throw new AppError('Missing required fields', 400, 'VALIDATION_ERROR');
    }

    const result = await registerService({
      email,
      password,
      firstName,
      lastName,
      phoneNumber
    });

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'User registered successfully',
      timestamp: new Date().toISOString()
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}; 