import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api';
import { APP_CONSTANTS } from '../config/constants';
import { ENV_CONFIG } from '../config/env';

export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, errorCode: string = APP_CONSTANTS.ERROR_CODES.INTERNAL_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode: number = APP_CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorCode: string = APP_CONSTANTS.ERROR_CODES.INTERNAL_ERROR;
  let message: string = 'Internal server error';

  // Log the error
  console.error('Error occurred:', {
    message: error.message,
    stack: ENV_CONFIG.FEATURES.ENABLE_DETAILED_ERRORS ? error.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    errorCode = error.errorCode;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    statusCode = APP_CONSTANTS.HTTP_STATUS.BAD_REQUEST;
    errorCode = APP_CONSTANTS.ERROR_CODES.VALIDATION_ERROR;
    message = error.message;
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED;
    errorCode = APP_CONSTANTS.ERROR_CODES.INVALID_TOKEN;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = APP_CONSTANTS.HTTP_STATUS.UNAUTHORIZED;
    errorCode = APP_CONSTANTS.ERROR_CODES.INVALID_TOKEN;
    message = 'Token expired';
  }

  const response: ApiResponse = {
    success: false,
    message,
    error: {
      code: errorCode,
      message: message,
      ...(ENV_CONFIG.FEATURES.ENABLE_DETAILED_ERRORS && {
        stack: error.stack,
        details: error.message
      })
    },
    timestamp: new Date().toISOString()
  };

  res.status(statusCode).json(response);
}; 