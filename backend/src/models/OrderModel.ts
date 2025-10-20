import { ulid } from 'ulid';

// Order status enum for type safety
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

// Status display names mapping
export const ORDER_STATUS_DISPLAY_NAMES: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.PARTIALLY_FULFILLED]: 'Partially Fulfilled',
  [OrderStatus.FULFILLED]: 'Fulfilled',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.FAILED]: 'Failed'
};

// Order item interface for type safety
export interface OrderItem {
  brandId: string;           // Brand ID (e.g., 'amazon')
  brandName: string;         // Brand name (e.g., 'Amazon')
  variantId: string;         // Variant ID (e.g., 'amazon-500')
  variantName: string;       // Variant name (e.g., '₹500 Gift Card')
  unitPrice: number;         // Price per item in cents/paise
  requestedQuantity: number; // Requested quantity
  fulfilledQuantity: number; // Fulfilled quantity
  totalPrice: number;        // Total price in cents/paise
  fulfilledPrice: number;    // Fulfilled price in cents/paise
  refundedPrice: number;     // Refunded price in cents/paise
}

// Fulfillment details interface
export interface FulfillmentDetails {
  attemptedAt?: string;
  fulfilledAt?: string;
  partialFulfillment: boolean;
  refundProcessed: boolean;
  totalGiftCardsAllocated?: number;
  giftCards?: Array<{
    giftCardId: string;
    giftCardNumber: string;
    giftCardPin: string;
    denomination: number;
    expiryTime: string;
  }>;
}

// Order class - exact DynamoDB item structure with constructor and methods
export class Order {
  readonly orderId: string;          // ULID - Primary Key (immutable)
  readonly userId: string;           // User reference (immutable)
  readonly createdAt: string;        // ISO timestamp (immutable)
  
  status: OrderStatus;
  totalAmount: number;               // Total order amount in cents/paise
  paidAmount: number;                // Amount debited from wallet
  refundAmount: number;              // Amount refunded due to partial fulfillment
  items: OrderItem[];
  fulfillmentDetails?: FulfillmentDetails;
  updatedAt: string;                 // ISO timestamp

  constructor(data: {
    orderId: string;
    userId: string;
    status?: OrderStatus;
    totalAmount: number;
    paidAmount: number;
    refundAmount?: number;
    items: OrderItem[];
    fulfillmentDetails?: FulfillmentDetails;
    createdAt?: string;
    updatedAt?: string;
  }) {
    // Validate required fields
    this.validateRequiredFields(data);
    
    // Immutable fields
    this.orderId = data.orderId;
    this.userId = data.userId;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    // Mutable fields
    this.status = data.status ?? OrderStatus.PENDING;
    this.totalAmount = this.validateAmount(data.totalAmount, 'total amount');
    this.paidAmount = this.validateAmount(data.paidAmount, 'paid amount');
    this.refundAmount = data.refundAmount ? this.validateAmount(data.refundAmount, 'refund amount') : 0;
    this.items = this.validateItems(data.items);
    this.fulfillmentDetails = data.fulfillmentDetails;
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
  }

  // Create new order instance with validation
  static create(data: {
    userId: string;
    totalAmount: number;
    paidAmount: number;
    items: Omit<OrderItem, 'fulfilledQuantity' | 'fulfilledPrice' | 'refundedPrice'>[];
  }): Order {
    // Initialize fulfillment fields for items
    const orderItems: OrderItem[] = data.items.map(item => ({
      ...item,
      fulfilledQuantity: 0,
      fulfilledPrice: 0,
      refundedPrice: 0
    }));

    return new Order({
      orderId: ulid(),
      ...data,
      items: orderItems
    });
  }

  // Get display name for order status
  static getStatusDisplayName(status: OrderStatus): string {
    return ORDER_STATUS_DISPLAY_NAMES[status] || status;
  }

  // Update order status with validation
  updateStatus(status: OrderStatus): Order {
    this.validateStatusTransition(this.status, status);
    this.status = status;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Mark order as processing
  markAsProcessing(): Order {
    return this.updateStatus(OrderStatus.PROCESSING);
  }

  // Mark order as fulfilled
  markAsFulfilled(fulfillmentDetails?: Partial<FulfillmentDetails>): Order {
    this.updateStatus(OrderStatus.FULFILLED);
    this.fulfillmentDetails = {
      partialFulfillment: false,
      refundProcessed: this.refundAmount > 0,
      ...this.fulfillmentDetails,
      ...fulfillmentDetails,
      fulfilledAt: new Date().toISOString()
    };
    return this;
  }

  // Mark order as partially fulfilled
  markAsPartiallyFulfilled(refundAmount: number, fulfillmentDetails?: Partial<FulfillmentDetails>): Order {
    this.updateStatus(OrderStatus.PARTIALLY_FULFILLED);
    this.refundAmount = this.validateAmount(refundAmount, 'refund amount');
    this.fulfillmentDetails = {
      partialFulfillment: true,
      refundProcessed: true,
      ...this.fulfillmentDetails,
      ...fulfillmentDetails,
      fulfilledAt: new Date().toISOString()
    };
    return this;
  }

  // Mark order as failed
  markAsFailed(refundAmount?: number): Order {
    this.updateStatus(OrderStatus.FAILED);
    if (refundAmount !== undefined) {
      this.refundAmount = this.validateAmount(refundAmount, 'refund amount');
    }
    this.fulfillmentDetails = {
      partialFulfillment: false,
      refundProcessed: this.refundAmount > 0,
      ...this.fulfillmentDetails,
      attemptedAt: new Date().toISOString()
    };
    return this;
  }

  // Cancel order
  cancel(): Order {
    if (this.status === OrderStatus.FULFILLED) {
      throw new Error('Cannot cancel a fulfilled order');
    }
    return this.updateStatus(OrderStatus.CANCELLED);
  }

  // Add fulfillment details
  addFulfillmentDetails(details: Partial<FulfillmentDetails>): Order {
    this.fulfillmentDetails = {
      partialFulfillment: this.fulfillmentDetails?.partialFulfillment ?? false,
      refundProcessed: this.fulfillmentDetails?.refundProcessed ?? false,
      ...this.fulfillmentDetails,
      ...details
    };
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Computed properties
  get isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  get isProcessing(): boolean {
    return this.status === OrderStatus.PROCESSING;
  }

  get isFulfilled(): boolean {
    return this.status === OrderStatus.FULFILLED;
  }

  get isPartiallyFulfilled(): boolean {
    return this.status === OrderStatus.PARTIALLY_FULFILLED;
  }

  get isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }

  get isFailed(): boolean {
    return this.status === OrderStatus.FAILED;
  }

  get isCompleted(): boolean {
    return this.isFulfilled || this.isPartiallyFulfilled || this.isFailed;
  }

  get hasRefund(): boolean {
    return this.refundAmount > 0;
  }

  get totalItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.requestedQuantity, 0);
  }

  get fulfilledItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.fulfilledQuantity, 0);
  }

  // Get formatted amounts for display
  get formattedTotalAmount(): string {
    return this.formatAmount(this.totalAmount);
  }

  get formattedPaidAmount(): string {
    return this.formatAmount(this.paidAmount);
  }

  get formattedRefundAmount(): string {
    return this.formatAmount(this.refundAmount);
  }

  // Get display name for current status
  get statusDisplayName(): string {
    return Order.getStatusDisplayName(this.status);
  }

  // Get order summary
  getSummary(): {
    orderId: string;
    status: OrderStatus;
    totalAmount: number;
    formattedTotalAmount: string;
    itemCount: number;
    fulfilledItemCount: number;
    hasRefund: boolean;
    isCompleted: boolean;
  } {
    return {
      orderId: this.orderId,
      status: this.status,
      totalAmount: this.totalAmount,
      formattedTotalAmount: this.formattedTotalAmount,
      itemCount: this.totalItemCount,
      fulfilledItemCount: this.fulfilledItemCount,
      hasRefund: this.hasRefund,
      isCompleted: this.isCompleted
    };
  }

  // Private methods
  private formatAmount(amount: number): string {
    const amountInRupees = amount / 100;
    return `₹${amountInRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  private validateRequiredFields(data: any): void {
    const required = ['orderId', 'userId', 'totalAmount', 'paidAmount', 'items'];
    for (const field of required) {
      if (data[field] === undefined || data[field] === null) {
        throw new Error(`${field} is required`);
      }
    }
  }

  private validateAmount(amount: number, fieldName: string): number {
    if (amount < 0) {
      throw new Error(`${fieldName} cannot be negative`);
    }
    if (!Number.isInteger(amount)) {
      throw new Error(`${fieldName} must be an integer (in paise)`);
    }
    return amount;
  }

  private validateItems(items: OrderItem[]): OrderItem[] {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    return items.map(item => this.validateOrderItem(item));
  }

  private validateOrderItem(item: any): OrderItem {
    const required = ['brandId', 'brandName', 'variantId', 'variantName', 'unitPrice', 'requestedQuantity', 'totalPrice'];
    for (const field of required) {
      if (item[field] === undefined || item[field] === null) {
        throw new Error(`Order item ${field} is required`);
      }
    }

    if (item.requestedQuantity <= 0) {
      throw new Error('Order item requested quantity must be positive');
    }

    if (item.unitPrice <= 0) {
      throw new Error('Order item unit price must be positive');
    }

    return {
      brandId: item.brandId,
      brandName: item.brandName.trim(),
      variantId: item.variantId,
      variantName: item.variantName.trim(),
      unitPrice: item.unitPrice,
      requestedQuantity: item.requestedQuantity,
      fulfilledQuantity: item.fulfilledQuantity || 0,
      totalPrice: item.totalPrice,
      fulfilledPrice: item.fulfilledPrice || 0,
      refundedPrice: item.refundedPrice || 0
    };
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.FULFILLED, OrderStatus.PARTIALLY_FULFILLED, OrderStatus.FAILED, OrderStatus.CANCELLED],
      [OrderStatus.PARTIALLY_FULFILLED]: [OrderStatus.CANCELLED],
      [OrderStatus.FULFILLED]: [],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.FAILED]: []
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
  }
}

// Table configuration
export const ORDER_TABLE = process.env.ORDERS_TABLE || 'giftify-orders';
export const USER_ORDERS_GSI = 'UserOrdersIndex';
export const ORDER_STATUS_GSI = 'OrderStatusIndex'; 