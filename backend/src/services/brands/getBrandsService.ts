import { brandRepository } from '../../repositories/brandRepository';
import { BrandResponse } from '../../types/brand';
import { AppError } from '../../middleware/errorHandler';

/**
 * Get all brands - Single API endpoint
 * Frontend will handle all filtering, sorting, and searching
 */
export const getAllBrandsService = async (): Promise<BrandResponse[]> => {
  try {
    // Get all active brands from database
    const brands = await brandRepository.findAllActive();

    // Transform to simple response format
    const brandResponses: BrandResponse[] = brands.map(brand => ({
      id: brand.brandId,
      name: brand.name,
      logo: brand.logo,
      category: brand.category,
      description: brand.description,
      vouchersSold: brand.vouchersSold,
      popularity: brand.popularity,
      // Return only active variants for frontend
      variants: brand.getActiveVariants().map(v => ({
        id: v.id,
        name: v.name,
        originalPrice: v.originalPrice,
        salePrice: v.salePrice,
        discountPercent: v.discountPercent,
        description: v.description,
        vouchersSold: v.vouchersSold
      }))
    }));

    return brandResponses;

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new AppError(`Failed to fetch brands: ${error.message}`, 500, 'BRANDS_FETCH_FAILED');
    }

    throw new AppError('Failed to fetch brands', 500, 'BRANDS_FETCH_FAILED');
  }
};
