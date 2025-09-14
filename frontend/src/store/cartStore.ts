import { create } from 'zustand';
import { cartService } from '../services/cartService';
import { SUCCESS_MESSAGES } from '../utils/constants';
import type { CartState, CartActions, AddToCartRequest } from '../types/cart';

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>((set, get) => ({
  // State
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isLoading: false,
  error: null,
  isOpen: false,

  // Actions
  addItem: async (variantId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const request: AddToCartRequest = { variantId, quantity };
      await cartService.manageCart(request);
      
      // Refresh cart after adding item
      await get().fetchCart();
      
      console.log(SUCCESS_MESSAGES.ITEM_ADDED_TO_CART);
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'error' in error 
        ? (error as { error?: { message?: string } }).error?.message || 'Failed to add item to cart'
        : 'Failed to add item to cart';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  updateQuantity: async (variantId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const request: AddToCartRequest = { variantId, quantity };
      await cartService.manageCart(request);
      
      // Refresh cart after updating
      await get().fetchCart();
      
      console.log(SUCCESS_MESSAGES.CART_UPDATED);
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'error' in error 
        ? (error as { error?: { message?: string } }).error?.message || 'Failed to update cart'
        : 'Failed to update cart';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  removeItem: async (variantId: string) => {
    // Remove item by setting quantity to 0
    await get().updateQuantity(variantId, 0);
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await cartService.clearCart();
      
      set({
        items: [],
        totalAmount: 0,
        totalItems: 0,
        isLoading: false,
        error: null,
      });
      
      console.log(SUCCESS_MESSAGES.CART_CLEARED);
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'error' in error 
        ? (error as { error?: { message?: string } }).error?.message || 'Failed to clear cart'
        : 'Failed to clear cart';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const cart = await cartService.getCart();
      
      set({
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'error' in error 
        ? (error as { error?: { message?: string } }).error?.message || 'Failed to fetch cart'
        : 'Failed to fetch cart';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  openCart: () => {
    set({ isOpen: true });
  },

  closeCart: () => {
    set({ isOpen: false });
  },

  clearError: () => {
    set({ error: null });
  },
})); 