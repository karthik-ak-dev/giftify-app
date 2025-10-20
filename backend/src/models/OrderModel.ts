import { ulid } from 'ulid';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export const ORDER_STATUS_DISPLAY_NAMES: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.PARTIALLY_FULFILLED]: 'Partially Fulfilled',
  [OrderStatus.FULFILLED]: 'Fulfilled',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.FAILED]: 'Failed'
};

export interface OrderItem {
  brandId: string;
  brandName: string;
  variantId: string;
  variantName: string;
  unitPrice: number;
  requestedQuantity: number;
  fulfilledQuantity: number;
  totalPrice: number;
  fulfilledPrice: number;
  refundedPrice: number;
}

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

export class Order {
  readonly orderId: string;
  readonly userId: string;
  readonly createdAt: string;
  
  status: OrderStatus;
  totalAmount: number;
  paidAmount: number;
  refundAmount: number;
  items: OrderItem[];
  fulfillmentDetails?: FulfillmentDetails;
  updatedAt: string;

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
    this.validateRequiredFields(data);
    
    this.orderId = data.orderId;
    this.userId = data.userId;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    this.status = data.status ?? OrderStatus.PENDING;
    this.totalAmount = this.validateAmount(data.totalAmount, 'total amount');
    this.paidAmount = this.validateAmount(data.paidAmount, 'paid amount');
    this.refundAmount = data.refundAmount ? this.validateAmount(data.refundAmount, 'refund amount') : 0;
    this.items = this.validateItems(data.items);
    this.fulfillmentDetails = data.fulfillmentDetails;
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
  }

  static create(data: {
    userId: string;
    totalAmount: number;
    paidAmount: number;
    items: Omit<OrderItem, 'fulfilledQuantity' | 'fulfilledPrice' | 'refundedPrice'>[];
  }): Order {
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

  static getStatusDisplayName(status: OrderStatus): string {
    return ORDER_STATUS_DISPLAY_NAMES[status] || status;
  }

  updateStatus(status: OrderStatus): Order {
    this.validateStatusTransition(this.status, status);
    this.status = status;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  markAsProcessing(): Order {
    return this.updateStatus(OrderStatus.PROCESSING);
  }

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

  cancel(): Order {
    if (this.status === OrderStatus.FULFILLED) {
      throw new Error('Cannot cancel a fulfilled order');
    }
    return this.updateStatus(OrderStatus.CANCELLED);
  }

  get isPending(): boolean {
    return this.status === OrderStatus.PENDING;
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

  get statusDisplayName(): string {
    return Order.getStatusDisplayName(this.status);
  }

  get formattedTotalAmount(): string {
    return this.formatAmount(this.totalAmount);
  }

  get formattedPaidAmount(): string {
    return this.formatAmount(this.paidAmount);
  }

  get formattedRefundAmount(): string {
    return this.formatAmount(this.refundAmount);
  }

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

export const ORDER_TABLE = process.env.ORDERS_TABLE || 'giftify-orders';
export const USER_ORDERS_GSI = 'UserOrdersIndex';
export const ORDER_STATUS_GSI = 'OrderStatusIndex';
