// Product types
export interface Product {
  productId: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  termsAndConditions: string;
  howToRedeem: string;
  createdAt: string;
  updatedAt: string;
}

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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
} 