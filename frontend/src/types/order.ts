/**
 * Order Types
 * Based on backend OrderModel and order types
 */

// Order Status from backend
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  FULFILLED = 'FULFILLED',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

// Order Item Response from backend
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
  formattedUnitPrice: string;
  formattedTotalPrice: string;
  formattedFulfilledPrice: string;
  formattedRefundedPrice: string;
  isFullyFulfilled: boolean;
  isPartiallyFulfilled: boolean;
  isNotFulfilled: boolean;
  fulfillmentPercentage: number;
}

// Fulfillment Details from backend
export interface FulfillmentDetails {
  attemptedAt?: string;
  fulfilledAt?: string;
  partialFulfillment: boolean;
  refundProcessed: boolean;
  formattedAttemptedAt?: string;
  formattedFulfilledAt?: string;
}

// Order Response from backend
export interface Order {
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
  items: OrderItem[];
  fulfillmentDetails?: FulfillmentDetails;
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

// Create Order Response from backend
export interface CreateOrderResponse {
  orderId: string;
  status: OrderStatus;
  statusDisplayName: string;
  totalAmount: number;
  paidAmount: number;
  refundAmount: number;
  formattedTotalAmount: string;
  formattedPaidAmount: string;
  formattedRefundAmount: string;
  fulfillmentDetails: {
    attemptedAt: string;
    partialFulfillment: boolean;
    refundProcessed: boolean;
    totalItemsRequested: number;
    totalItemsFulfilled: number;
    totalGiftCardsAllocated: number;
    fulfillmentSummary: {
      fulfilledAmount: number;
      fulfilledAmountFormatted: string;
      refundedAmount: number;
      refundedAmountFormatted: string;
    };
    giftCards: Array<{
      giftCardId: string;
      productName: string;
      variantName: string;
      denomination: number;
      giftCardNumber: string;
      giftCardPin: string;
      expiryTime: string;
      denominationFormatted: string;
    }>;
    unavailableItems: Array<{
      productName: string;
      variantName: string;
      requestedQuantity: number;
      reason: string;
      refundAmount: number;
      refundAmountFormatted: string;
    }>;
  };
  createdAt: string;
  message: string;
}

// Cancel Order Response from backend
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