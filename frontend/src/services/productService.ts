import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { Product, ProductFilters } from '../types/product';

export const productService = {
  /**
   * Get all products with variants
   */
  getProducts: async (filters?: ProductFilters): Promise<{ products: Product[] }> => {
    const response = await apiClient.get<{ products: Product[] }>(
      API_ENDPOINTS.PRODUCTS,
      filters as Record<string, unknown>
    );
    return response.data!;
  },

  /**
   * Get product by ID
   */
  getProductById: async (productId: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
    return response.data!;
  },
}; 