/**
 * Order Store
 * Zustand store for managing order state
 */

import { create } from 'zustand';
import { orderService } from '../services/orderService';
import type { Order, CreateOrderResponse } from '../types/order';

export interface OrderStore {
  // State
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  createOrder: () => Promise<CreateOrderResponse>;
  cancelOrder: (orderId: string) => Promise<void>;
  clearError: () => void;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  // Initial state
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  // Actions
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const orders = await orderService.getOrders();
      set({
        orders,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
      set({
        isLoading: false,
        error: errorMessage
      });
    }
  },

  fetchOrderById: async (orderId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const order = await orderService.getOrderById(orderId);
      set({
        currentOrder: order,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order';
      set({
        isLoading: false,
        error: errorMessage
      });
    }
  },

  createOrder: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const orderResponse = await orderService.createOrder();
      
      // Refresh orders list
      await get().fetchOrders();
      
      set({
        isLoading: false,
        error: null
      });
      
      return orderResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      set({
        isLoading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  cancelOrder: async (orderId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await orderService.cancelOrder(orderId);
      
      // Refresh orders list
      await get().fetchOrders();
      
      set({
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel order';
      set({
        isLoading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null });
  }
})); 