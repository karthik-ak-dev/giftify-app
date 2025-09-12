import { Request, Response, NextFunction } from 'express';
import { getProductsService } from '../../services/products/getProductsService';
import { ApiResponse } from '../../types/api';

export const getProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await getProductsService();

    const response: ApiResponse = {
      success: true,
      data: products,
      message: 'Products retrieved successfully',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}; 