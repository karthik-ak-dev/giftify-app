import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { Cart, CartSummary, AddToCartRequest } from '../types/cart';

export const cartService = {
  /**
   * Get user's cart
   */
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>(API_ENDPOINTS.CART);
    return response.data!;
  },

  /**
   * Add or update item in cart
   */
  manageCart: async (request: AddToCartRequest): Promise<{ cartSummary: CartSummary }> => {
    const response = await apiClient.put<{ cartSummary: CartSummary }>(
      API_ENDPOINTS.CART_MANAGE,
      request
    );
    return response.data!;
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CART_CLEAR);
  },
}; 