/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  PROFILE: '/users/profile',
  
  // Product endpoints
  PRODUCTS: '/products',
  
  // Cart endpoints
  CART: '/cart',
  CART_MANAGE: '/cart/manage',
  CART_CLEAR: '/cart/clear',
  
  // Order endpoints
  ORDERS: '/orders',
  ORDER_CREATE: '/orders/create',
  ORDER_CANCEL: (orderId: string) => `/orders/${orderId}/cancel`,
  ORDER_DETAILS: (orderId: string) => `/orders/${orderId}`,
  
  // Wallet endpoints
  WALLET_BALANCE: '/wallet/balance',
  WALLET_TOPUP: '/wallet/topup',
  WALLET_TRANSACTIONS: '/wallet/transactions',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'giftify_access_token',
  REFRESH_TOKEN: 'giftify_refresh_token',
  USER_DATA: 'giftify_user_data',
  CART_DATA: 'giftify_cart_data',
  THEME_PREFERENCE: 'giftify_theme',
} as const;

// Application Limits
export const APP_LIMITS = {
  MAX_CART_ITEMS: 50,
  MAX_QUANTITY_PER_ITEM: 100,
  MIN_WALLET_TOPUP: 100, // ₹1.00 in paise
  MAX_WALLET_TOPUP: 10000000, // ₹100,000.00 in paise
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 254,
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Product Categories
export const PRODUCT_CATEGORIES = {
  FOOD_DELIVERY: 'Food Delivery',
  SHOPPING: 'Shopping',
  ENTERTAINMENT: 'Entertainment',
  TRAVEL: 'Travel',
  GAMING: 'Gaming',
  FASHION: 'Fashion',
  ELECTRONICS: 'Electronics',
  BOOKS: 'Books',
  HEALTH: 'Health & Wellness',
  OTHER: 'Other',
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  CREDIT: 'Credit',
  DEBIT: 'Debit',
  REFUND: 'Refund',
} as const;

// Order Status Display Names
export const ORDER_STATUS_NAMES = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  PARTIALLY_FULFILLED: 'Partially Fulfilled',
  FULFILLED: 'Fulfilled',
  CANCELLED: 'Cancelled',
  FAILED: 'Failed',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  CART_EMPTY: 'Your cart is empty. Add some items to continue.',
  INSUFFICIENT_BALANCE: 'Insufficient wallet balance. Please top up your wallet.',
  OUT_OF_STOCK: 'This item is currently out of stock.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back! You have been logged in successfully.',
  REGISTER_SUCCESS: 'Account created successfully! Welcome to Giftify.',
  PROFILE_UPDATED: 'Your profile has been updated successfully.',
  ITEM_ADDED_TO_CART: 'Item added to cart successfully.',
  CART_UPDATED: 'Cart updated successfully.',
  CART_CLEARED: 'Cart cleared successfully.',
  ORDER_PLACED: 'Your order has been placed successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully.',
  WALLET_TOPPED_UP: 'Wallet topped up successfully.',
  LOGOUT_SUCCESS: 'You have been logged out successfully.',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_MODE: import.meta.env.VITE_APP_ENV === 'development',
  ENABLE_PERFORMANCE_MONITORING: import.meta.env.VITE_APP_ENV === 'production',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_APP_ENV === 'production',
} as const;

// Environment
export const ENV = {
  NODE_ENV: import.meta.env.MODE,
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const; 