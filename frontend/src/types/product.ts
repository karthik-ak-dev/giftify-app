/**
 * Product Types
 * Based on backend ProductModel and product types
 */

// Product Category from backend ProductModel
export const ProductCategory = {
  FOOD_DELIVERY: 'FOOD_DELIVERY',
  SHOPPING: 'SHOPPING',
  ENTERTAINMENT: 'ENTERTAINMENT',
  TRAVEL: 'TRAVEL',
  GAMING: 'GAMING',
  OTHER: 'OTHER'
} as const;

export type ProductCategory = typeof ProductCategory[keyof typeof ProductCategory];

// Product Variant Response from backend
export interface ProductVariant {
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
  isActive: string; // API returns string "true"/"false"
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

// Product with Variants Response from backend
export interface Product {
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
  variants: ProductVariant[];
  variantCount: number;
  activeVariantCount: number;
  priceRange: {
    min: number;
    max: number;
    minFormatted: string;
    maxFormatted: string;
  } | null;
  denominationRange: {
    min: number;
    max: number;
  } | null;
  hasStock: boolean;
  totalStock: number;
}

// Product filters
export interface ProductFilters {
  category?: ProductCategory;
  brand?: string;
  activeOnly?: boolean;
} 