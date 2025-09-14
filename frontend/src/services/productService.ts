/**
 * Product Service
 * Handles product-related API calls
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { Product, ProductFilters } from '../types/product';

export const productService = {
  /**
   * Get all products with optional filters
   */
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const response = await apiClient.get<{ 
      success: boolean; 
      data: Product[]; // Products are directly in data array
      message: string;
      timestamp: string;
    }>(API_ENDPOINTS.PRODUCTS, { params: filters });
    
    if (!response.data?.success || !response.data.data) {
      throw new Error('Failed to fetch products');
    }
    
    return response.data.data;
  }
}; 