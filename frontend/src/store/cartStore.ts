/**
 * Cart Store
 * Zustand store for managing cart state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '../services/cartService';
import type { CartItem } from '../types/cart';

export interface CartStore {
  // State
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  closeCart: () => void;
  clearError: () => void;
  
  // Computed
  totalItems: number;
  totalAmount: number;
  isEmpty: boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isLoading: false,
      error: null,
      isOpen: false,

      // Actions
      fetchCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const items = await cartService.getCart();
          set({
            items,
            isLoading: false,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cart';
          set({
            isLoading: false,
            error: errorMessage
          });
        }
      },

      addToCart: async (variantId: string, quantity: number) => {
        set({ isLoading: true, error: null });
        
        try {
          const items = await cartService.manageCart({
            variantId,
            action: 'ADD',
            quantity
          });
          
          set({
            items,
            isLoading: false,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
          set({
            isLoading: false,
            error: errorMessage
          });
          throw error;
        }
      },

      updateQuantity: async (variantId: string, quantity: number) => {
        set({ isLoading: true, error: null });
        
        try {
          const items = await cartService.manageCart({
            variantId,
            action: 'UPDATE',
            quantity
          });
          
          set({
            items,
            isLoading: false,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update cart';
          set({
            isLoading: false,
            error: errorMessage
          });
          throw error;
        }
      },

      removeFromCart: async (variantId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const items = await cartService.manageCart({
            variantId,
            action: 'REMOVE'
          });
          
          set({
            items,
            isLoading: false,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to remove from cart';
          set({
            isLoading: false,
            error: errorMessage
          });
          throw error;
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await cartService.clearCart();
          set({
            items: [],
            isLoading: false,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
          set({
            isLoading: false,
            error: errorMessage
          });
          throw error;
        }
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      clearError: () => {
        set({ error: null });
      },

      // Computed properties
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      get totalAmount() {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      },

      get isEmpty() {
        return get().items.length === 0;
      }
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({ 
        items: state.items 
      })
    }
  )
); 