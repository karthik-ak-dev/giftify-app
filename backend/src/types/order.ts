import { OrderStatus } from '../models/OrderModel';
import { TransactionStatus } from '../models/WalletTransactionModel';

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
  status: 'PENDING' | 'PROCESSING' | 'PARTIALLY_FULFILLED' | 'FULFILLED' | 'CANCELLED' | 'FAILED';
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

export interface CreateOrderRequest {
  items: {
    variantId: string;
    quantity: number;
  }[];
}

// Enhanced response interfaces for services
export interface OrderItemResponse {
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
  formattedUnitPrice: string;
  formattedTotalPrice: string;
  formattedFulfilledPrice: string;
  formattedRefundedPrice: string;
  isFullyFulfilled: boolean;
  isPartiallyFulfilled: boolean;
  isNotFulfilled: boolean;
  fulfillmentPercentage: number;
}

export interface FulfillmentDetailsResponse {
  attemptedAt?: string;
  fulfilledAt?: string;
  partialFulfillment: boolean;
  refundProcessed: boolean;
  formattedAttemptedAt?: string;
  formattedFulfilledAt?: string;
}

export interface OrderResponse {
  orderId: string;
  userId: string;
  status: OrderStatus;
  statusDisplayName: string;
  totalAmount: number;
  paidAmount: number;
  refundAmount: number;
  formattedTotalAmount: string;
  formattedPaidAmount: string;
  formattedRefundAmount: string;
  items: OrderItemResponse[];
  fulfillmentDetails?: FulfillmentDetailsResponse;
  createdAt: string;
  updatedAt: string;
  formattedCreatedAt: string;
  formattedUpdatedAt: string;
  canBeCancelled: boolean;
  canBeRefunded: boolean;
  isCompleted: boolean;
  isPending: boolean;
  isCancelled: boolean;
  isFailed: boolean;
  totalItems: number;
  totalFulfilledItems: number;
  totalRefundedAmount: number;
  daysSinceCreated: number;
}

export interface CancelOrderResponse {
  orderId: string;
  status: OrderStatus;
  refundAmount: number;
  formattedRefundAmount: string;
  transactionId: string;
  newWalletBalance: number;
  formattedNewWalletBalance: string;
  message: string;
  cancelledAt: string;
}

 