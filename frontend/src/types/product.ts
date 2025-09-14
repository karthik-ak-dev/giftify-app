export interface Product {
  productId: string;
  name: string;
  description: string;
  brand: string;
  category: ProductCategory;
  imageUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  termsAndConditions: string;
  howToRedeem: string;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  variantId: string;
  productId: string;
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

export const ProductCategory = {
  FOOD_DELIVERY: 'FOOD_DELIVERY',
  SHOPPING: 'SHOPPING',
  ENTERTAINMENT: 'ENTERTAINMENT',
  TRAVEL: 'TRAVEL',
  GAMING: 'GAMING',
  FASHION: 'FASHION',
  ELECTRONICS: 'ELECTRONICS',
  BOOKS: 'BOOKS',
  HEALTH: 'HEALTH',
  OTHER: 'OTHER'
} as const;

export type ProductCategory = typeof ProductCategory[keyof typeof ProductCategory];

export interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: ProductCategory | null;
  searchQuery: string;
}

export interface ProductActions {
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getVariantById: (id: string) => ProductVariant | undefined;
  setSelectedCategory: (category: ProductCategory | null) => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
} 