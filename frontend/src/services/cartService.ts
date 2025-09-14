/**
 * Cart Service
 * Handles cart-related API calls
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { CartItem, ManageCartRequest } from '../types/cart';

export const cartService = {
  /**
   * Get user's cart
   */
  getCart: async (): Promise<CartItem[]> => {
    const response = await apiClient.get<{
      success: boolean;
      data: { items: CartItem[] };
    }>(API_ENDPOINTS.CART);
    
    if (!response.data?.success || !response.data.data) {
      throw new Error('Failed to fetch cart');
    }
    
    return response.data.data.items;
  },

  /**
   * Add/Update/Remove items in cart
   */
  manageCart: async (request: ManageCartRequest): Promise<CartItem[]> => {
    const response = await apiClient.post<{
      success: boolean;
      data: { items: CartItem[] };
    }>(API_ENDPOINTS.CART_MANAGE, request);
    
    if (!response.data?.success || !response.data.data) {
      throw new Error('Failed to manage cart');
    }
    
    return response.data.data.items;
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<void> => {
    const response = await apiClient.delete<{
      success: boolean;
    }>(API_ENDPOINTS.CART_CLEAR);
    
    if (!response.data?.success) {
      throw new Error('Failed to clear cart');
    }
  }
}; 