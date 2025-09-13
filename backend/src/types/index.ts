import { Request } from 'express';

// User types
export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

// Authenticated Request
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

// Product types
export interface Product {
  productId: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  termsAndConditions: string;
  howToRedeem: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  productId: string;
  variantId: string;
  name: string;
  denomination: number;
  mrp: number;
  costPrice: number;
  discountPercent: number;
  sellingPrice: number;
  stockQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart types
export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface OrderItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  requestedQuantity: number;
  fulfilledQuantity: number;
  totalPrice: number;
  fulfilledPrice: number;
  refundedPrice: number;
}

export interface Order {
  orderId: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'PARTIALLY_FULFILLED' | 'FULFILLED' | 'CANCELLED' | 'REFUNDED';
  totalAmount: number;
  paidAmount: number;
  refundAmount: number;
  items: OrderItem[];
  fulfillmentDetails?: {
    attemptedAt?: string;
    fulfilledAt?: string;
    partialFulfillment: boolean;
    refundProcessed: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Wallet types
export interface WalletTransaction {
  userId: string;
  transactionId: string;
  type: 'CREDIT' | 'DEBIT' | 'REFUND';
  amount: number;
  balanceAfter: number;
  description: string;
  orderId?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

// Gift Card types
export interface GiftCard {
  giftCardId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  denomination: number;
  giftCardNumber: string;
  giftCardPin: string;
  expiryTime: string;        // ISO timestamp when card expires
  purchasePrice: number;
  usedByOrder?: string;      // Order ID if used, null/undefined if available
  usedByUser?: string;       // User ID if used, null/undefined if available
  usedAt?: string;           // ISO timestamp when used
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
} 