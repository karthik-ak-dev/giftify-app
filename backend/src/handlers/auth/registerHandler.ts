import { Request, Response, NextFunction } from 'express';
import { registerService } from '../../services/auth/registerService';
import { ApiResponse } from '../../types/api';

export const registerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    const result = await registerService({
      email,
      password,
      firstName,
      lastName,
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