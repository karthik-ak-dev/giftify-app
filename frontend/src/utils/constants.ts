/**
 * API Constants
 * Based on backend routes
 */

// API Base URL from environment
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API Endpoints matching backend routes
export const API_ENDPOINTS = {
  // Auth routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  
  // User routes
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  
  // Product routes
  PRODUCTS: '/products',
  
  // Cart routes
  CART: '/cart',
  CART_MANAGE: '/cart/manage',
  CART_CLEAR: '/cart/clear',
  
  // Order routes
  ORDERS: '/orders',
  CREATE_ORDER: '/orders/create',
  CANCEL_ORDER: (orderId: string) => `/orders/${orderId}/cancel`,
  
  // Wallet routes
  WALLET_BALANCE: '/wallet/balance',
  WALLET_TRANSACTIONS: '/wallet/transactions',
  WALLET_TOPUP: '/wallet/topup'
} as const;

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'giftify_access_token',
  REFRESH_TOKEN: 'giftify_refresh_token',
  USER: 'giftify_user'
} as const;

// App constants
export const APP_NAME = 'Giftify';
export const APP_VERSION = '1.0.0'; 