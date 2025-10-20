import { Request, Response, NextFunction } from 'express';
import { getAllBrandsService } from '../../services/brands/getBrandsService';

/**
 * Get all brands - Single endpoint
 * No query parameters needed - frontend will handle filtering
 */
export const getBrandsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const brands = await getAllBrandsService();

    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands
    });
  } catch (error) {
    next(error);
  }
};

