export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiEndpoints {
  // Auth endpoints
  LOGIN: string;
  REGISTER: string;
  REFRESH: string;
  PROFILE: string;
  
  // Product endpoints
  PRODUCTS: string;
  
  // Cart endpoints
  CART: string;
  CART_MANAGE: string;
  CART_CLEAR: string;
  
  // Order endpoints
  ORDERS: string;
  ORDER_CREATE: string;
  ORDER_CANCEL: string;
  
  // Wallet endpoints
  WALLET_BALANCE: string;
  WALLET_TOPUP: string;
  WALLET_TRANSACTIONS: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
} 