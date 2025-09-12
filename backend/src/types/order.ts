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