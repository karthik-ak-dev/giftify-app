import { OrderStatus } from '../models/OrderModel';

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

 