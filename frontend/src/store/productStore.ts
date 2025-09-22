/**
 * Product Store
 * Zustand store for managing product state
 */

import { create } from 'zustand';
import { productService } from '../services/productService';
import type { Product } from '../types/product';
import { ProductCategory } from '../types/product';

export interface ProductStore {
  // State
  products: Product[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: ProductCategory | null;
  searchQuery: string;
  
  // Actions
  fetchProducts: (category?: ProductCategory) => Promise<void>;
  setSelectedCategory: (category: ProductCategory | null) => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
  getFilteredProducts: () => Product[];
  getCategories: () => ProductCategory[];
}

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  products: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
  searchQuery: '',

  // Actions
  fetchProducts: async (category?: ProductCategory) => {
    set({ isLoading: true, error: null });
    
    try {
      const products = await productService.getProducts({
        category,
        activeOnly: true
      });
      
      console.log('Fetched products:', products); // Debug log
      
      set({
        products,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Product fetch error:', error); // Debug log
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      set({
        isLoading: false,
        error: errorMessage
      });
    }
  },

  setSelectedCategory: (category: ProductCategory | null) => {
    set({ selectedCategory: category });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ error: null });
  },

  // Helper functions
  getFilteredProducts: () => {
    const state = get();
    let filtered = state.products;
    
    console.log('Computing filtered products:', {
      totalProducts: state.products.length,
      selectedCategory: state.selectedCategory,
      searchQuery: state.searchQuery
    }); // Debug log
    
    // Filter by category
    if (state.selectedCategory) {
      filtered = filtered.filter(product => product.category === state.selectedCategory);
    }
    
    // Filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    console.log('Filtered products result:', filtered.length); // Debug log
    return filtered;
  },

  getCategories: () => {
    return Object.values(ProductCategory);
  }
})); 