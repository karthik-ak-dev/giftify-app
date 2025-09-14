import { create } from 'zustand';
import { productService } from '../services/productService';
import type { ProductCategory, ProductState, ProductActions } from '../types/product';

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>((set, get) => ({
  // State
  products: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
  searchQuery: '',

  // Actions
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { products } = await productService.getProducts({
        category: get().selectedCategory || undefined,
        search: get().searchQuery || undefined,
      });
      
      set({
        products,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'error' in error 
        ? (error as { error?: { message?: string } }).error?.message || 'Failed to fetch products'
        : 'Failed to fetch products';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  getProductById: (id: string) => {
    return get().products.find(product => product.productId === id);
  },

  getVariantById: (id: string) => {
    const products = get().products;
    for (const product of products) {
      const variant = product.variants.find(v => v.variantId === id);
      if (variant) return variant;
    }
    return undefined;
  },

  setSelectedCategory: (category: ProductCategory | null) => {
    set({ selectedCategory: category });
    // Automatically fetch products when category changes
    get().fetchProducts();
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    // Debounce search - in a real app, you'd want to debounce this
    setTimeout(() => {
      if (get().searchQuery === query) {
        get().fetchProducts();
      }
    }, 300);
  },

  clearError: () => {
    set({ error: null });
  },
})); 