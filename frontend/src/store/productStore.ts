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
  
  // Computed
  filteredProducts: Product[];
  categories: ProductCategory[];
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
      
      set({
        products,
        isLoading: false,
        error: null
      });
    } catch (error) {
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

  // Computed properties
  get filteredProducts() {
    const { products, selectedCategory, searchQuery } = get();
    
    let filtered = products;
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  },

  get categories() {
    return Object.values(ProductCategory);
  }
})); 