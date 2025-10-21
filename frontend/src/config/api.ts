// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://7bw9r5hpb3.execute-api.ap-south-1.amazonaws.com/stage',
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
    },
    USERS: {
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
    },
    WALLET: {
      TRANSACTIONS: '/wallet/transactions',
    },
    BRANDS: {
      ALL: '/brands',
    },
    CART: {
      GET: '/cart',
      MANAGE: '/cart/manage',
      CLEAR: '/cart/clear',
    },
    ORDERS: {
      CREATE: '/orders/create',
      LIST: '/orders',
      GET_BY_ID: (orderId: string) => `/orders/${orderId}`,
      CANCEL: (orderId: string) => `/orders/${orderId}/cancel`,
    },
  },
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

