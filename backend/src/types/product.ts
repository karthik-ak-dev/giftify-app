import { ProductCategory } from '../models/ProductModel';

// Enhanced response interfaces for services
export interface ProductVariantResponse {
  productId: string;
  variantId: string;
  name: string;
  denomination: number;
  mrp: number;
  costPrice: number;
  discountPercent: number;
  sellingPrice: number;
  stockQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  isActive: boolean;
  isInStock: boolean;
  isOutOfStock: boolean;
  hasLowStock: boolean;
  formattedMRP: string;
  formattedSellingPrice: string;
  profitMargin: number;
  profitPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface PriceRange {
  min: number;
  max: number;
  minFormatted: string;
  maxFormatted: string;
}

export interface DenominationRange {
  min: number;
  max: number;
}

export interface ProductWithVariantsResponse {
  productId: string;
  name: string;
  description: string;
  brand: string;
  category: ProductCategory;
  categoryDisplayName: string;
  displayName: string;
  imageUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  termsAndConditions: string;
  howToRedeem: string;
  hasCompleteInfo: boolean;
  hasImages: boolean;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariantResponse[];
  variantCount: number;
  activeVariantCount: number;
  priceRange: PriceRange | null;
  denominationRange: DenominationRange | null;
  hasStock: boolean;
  totalStock: number;
}

// Service options interface
export interface GetProductsOptions {
  category?: ProductCategory;
  brand?: string;
  activeOnly?: boolean;
  includeInactive?: boolean;
} 