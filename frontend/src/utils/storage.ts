import { CartItem, Order } from '../types';

const CART_KEY = 'giftify_cart';
const ORDERS_KEY = 'giftify_orders';

export const storage = {
  // Cart operations
  getCart: (): CartItem[] => {
    try {
      const cart = localStorage.getItem(CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  },

  saveCart: (cart: CartItem[]): void => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  clearCart: (): void => {
    try {
      localStorage.removeItem(CART_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  },

  // Order operations
  getOrders: (): Order[] => {
    try {
      const orders = localStorage.getItem(ORDERS_KEY);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  },

  saveOrder: (order: Order): void => {
    try {
      const orders = storage.getOrders();
      orders.unshift(order); // Add to beginning
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving order:', error);
    }
  },

  getAllOrders: (): Order[] => {
    return storage.getOrders();
  },
};

