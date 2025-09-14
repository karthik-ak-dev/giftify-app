/**
 * Order Service
 * Handles order-related API calls
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { Order, CreateOrderResponse, CancelOrderResponse } from '../types/order';

export const orderService = {
  /**
   * Get user's orders
   */
  getOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<{
      success: boolean;
      data: { orders: Order[] };
    }>(API_ENDPOINTS.ORDERS);
    
    if (!response.data?.success || !response.data.data) {
      throw new Error('Failed to fetch orders');
    }
    
    return response.data.data.orders;
  },

  /**
   * Get order by ID
   */
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<{
      success: boolean;
      data: { order: Order };
    }>(`${API_ENDPOINTS.ORDERS}/${orderId}`);
    
    if (!response.data?.success || !response.data.data) {
      throw new Error('Failed to fetch order');
    }
    
    return response.data.data.order;
  },

  /**
   * Create new order
   */
  createOrder: async (): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<{
      success: boolean;
      data: CreateOrderResponse;
    }>(API_ENDPOINTS.CREATE_ORDER);
    
    if (!response.data?.success || !response.data.data) {
      throw new Error('Failed to create order');
    }
    
    return response.data.data;
  },

  /**
   * Cancel order
   */
  cancelOrder: async (orderId: string): Promise<CancelOrderResponse> => {
    const response = await apiClient.post<{
      success: boolean;
      data: CancelOrderResponse;
    }>(API_ENDPOINTS.CANCEL_ORDER(orderId));
    
    if (!response.data?.success || !response.data.data) {
      throw new Error('Failed to cancel order');
    }
    
    return response.data.data;
  }
}; 