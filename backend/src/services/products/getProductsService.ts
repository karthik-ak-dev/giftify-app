import { productRepository } from '../../repositories/productRepository';
import { productVariantRepository } from '../../repositories/productVariantRepository';
import { Product } from '../../models/ProductModel';
import { AppError } from '../../middleware/errorHandler';
import { 
  ProductWithVariantsResponse, 
  ProductVariantResponse, 
  GetProductsOptions,
  PriceRange 
} from '../../types/product';

export const getProductsService = async (options?: GetProductsOptions): Promise<ProductWithVariantsResponse[]> => {
  try {
    const {
      category,
      brand,
      activeOnly = true,
      includeInactive = false
    } = options || {};

    let products: Product[] = [];

    // Fetch products based on filters
    if (category && brand) {
      products = await productRepository.findProductsByBrandAndCategory(brand, category);
    } else if (category) {
      products = activeOnly 
        ? await productRepository.findActiveByCategory(category)
        : await productRepository.findByCategory(category);
    } else if (brand) {
      const brandProducts = await productRepository.findByBrand(brand);
      products = activeOnly 
        ? brandProducts.filter(p => p.isActive)
        : brandProducts;
    } else {
      products = activeOnly 
        ? await productRepository.findAllActive()
        : await productRepository.findAll();
    }

    // Filter out inactive products if not explicitly including them
    if (!includeInactive) {
      products = products.filter(product => product.isActive);
    }

    // Get variants for each product and build enhanced response
    const productsWithVariants: ProductWithVariantsResponse[] = [];
    
    for (const product of products) {
      try {
        // Get all variants for the product
        const allVariants = await productVariantRepository.findByProductId(product.productId);
        
        // Filter variants based on activeOnly setting
        const variants = activeOnly 
          ? allVariants.filter(variant => variant.isActive)
          : allVariants;

        // Convert variants to response format with computed properties
        const variantResponses: ProductVariantResponse[] = variants.map(variant => ({
          productId: variant.productId,
          variantId: variant.variantId,
          name: variant.name,
          denomination: variant.denomination,
          mrp: variant.mrp,
          costPrice: variant.costPrice,
          discountPercent: variant.discountPercent,
          sellingPrice: variant.sellingPrice,
          stockQuantity: variant.stockQuantity,
          minOrderQuantity: variant.minOrderQuantity,
          maxOrderQuantity: variant.maxOrderQuantity,
          isActive: variant.isActive,
          isInStock: variant.isInStock,
          isOutOfStock: variant.isOutOfStock,
          hasLowStock: variant.hasLowStock,
          formattedMRP: variant.formattedMRP,
          formattedSellingPrice: variant.formattedSellingPrice,
          profitMargin: variant.profitMargin,
          profitPercentage: variant.profitPercentage,
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt
        }));

        // Calculate price range from active variants with stock
        const availableVariants = variantResponses.filter(v => v.isActive && v.isInStock);
        const priceRange: PriceRange | null = availableVariants.length > 0 ? {
          min: Math.min(...availableVariants.map(v => v.sellingPrice)),
          max: Math.max(...availableVariants.map(v => v.sellingPrice)),
          minFormatted: '',
          maxFormatted: ''
        } : null;

        if (priceRange) {
          const minInRupees = priceRange.min / 100;
          const maxInRupees = priceRange.max / 100;
          priceRange.minFormatted = `₹${minInRupees.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`;
          priceRange.maxFormatted = `₹${maxInRupees.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`;
        }

        // Calculate denomination range
        const denominationRange = availableVariants.length > 0 ? {
          min: Math.min(...availableVariants.map(v => v.denomination)),
          max: Math.max(...availableVariants.map(v => v.denomination))
        } : null;

        // Calculate stock information
        const totalStock = variantResponses.reduce((sum, v) => sum + v.stockQuantity, 0);
        const hasStock = variantResponses.some(v => v.isInStock);

        // Build enhanced product response
        const productResponse: ProductWithVariantsResponse = {
          productId: product.productId,
          name: product.name,
          description: product.description,
          brand: product.brand,
          category: product.category,
          categoryDisplayName: product.categoryDisplayName,
          displayName: product.displayName,
          imageUrl: product.imageUrl,
          thumbnailUrl: product.thumbnailUrl,
          isActive: product.isActive,
          termsAndConditions: product.termsAndConditions,
          howToRedeem: product.howToRedeem,
          hasCompleteInfo: product.hasCompleteInfo,
          hasImages: product.hasImages,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          variants: variantResponses,
          variantCount: allVariants.length,
          activeVariantCount: allVariants.filter(v => v.isActive).length,
          priceRange,
          denominationRange,
          hasStock,
          totalStock
        };

        productsWithVariants.push(productResponse);
      } catch (variantError) {
        // Log error but continue with other products
        console.error(`Error fetching variants for product ${product.productId}:`, variantError);
        
        // Add product without variants if variant fetch fails
        const productResponse: ProductWithVariantsResponse = {
          productId: product.productId,
          name: product.name,
          description: product.description,
          brand: product.brand,
          category: product.category,
          categoryDisplayName: product.categoryDisplayName,
          displayName: product.displayName,
          imageUrl: product.imageUrl,
          thumbnailUrl: product.thumbnailUrl,
          isActive: product.isActive,
          termsAndConditions: product.termsAndConditions,
          howToRedeem: product.howToRedeem,
          hasCompleteInfo: product.hasCompleteInfo,
          hasImages: product.hasImages,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          variants: [],
          variantCount: 0,
          activeVariantCount: 0,
          priceRange: null,
          denominationRange: null,
          hasStock: false,
          totalStock: 0
        };

        productsWithVariants.push(productResponse);
      }
    }

    // Sort products by name for consistent ordering
    productsWithVariants.sort((a, b) => a.name.localeCompare(b.name));

    return productsWithVariants;

  } catch (error) {
    // Handle different types of errors
    if (error instanceof AppError) {
      throw error;
    }

    // Handle repository errors
    if (error instanceof Error && (
      error.message.includes('not found') ||
      error.message.includes('does not exist')
    )) {
      throw new AppError('Products not found', 404, 'PRODUCTS_NOT_FOUND');
    }

    // Handle validation errors from models
    if (error instanceof Error && (
      error.message.includes('required') ||
      error.message.includes('Invalid') ||
      error.message.includes('cannot be empty')
    )) {
      throw new AppError(`Product validation error: ${error.message}`, 400, 'PRODUCT_VALIDATION_ERROR');
    }

    // Handle any other unexpected errors
    if (error instanceof Error) {
      throw new AppError(`Failed to fetch products: ${error.message}`, 500, 'PRODUCTS_FETCH_FAILED');
    }

    throw new AppError('Failed to fetch products', 500, 'PRODUCTS_FETCH_FAILED');
  }
}; 