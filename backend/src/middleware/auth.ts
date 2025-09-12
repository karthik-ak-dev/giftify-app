import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../types/auth';
import { AppError } from './errorHandler';
import { APP_CONSTANTS } from '../config/constants';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AppError('Access token required', APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED, APP_CONSTANTS.ERROR_CODES.MISSING_TOKEN);
    }

    const decoded = verifyAccessToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired token', APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED, APP_CONSTANTS.ERROR_CODES.INVALID_TOKEN));
    }
  }
}; 