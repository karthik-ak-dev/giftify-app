import { Order } from '../types/order';

export class OrderModel {
  static readonly tableName = process.env.ORDERS_TABLE || 'giftify-orders';
  
  // Primary Key
  static readonly partitionKey = 'orderId';
  
  // GSI Keys
  static readonly userOrdersGSI = 'UserOrdersIndex';
  static readonly userOrdersGSIPartitionKey = 'userId';
  static readonly userOrdersGSISortKey = 'createdAt';
  
  static readonly orderStatusGSI = 'OrderStatusIndex';
  static readonly orderStatusGSIPartitionKey = 'status';
  static readonly orderStatusGSISortKey = 'createdAt';
  
  // Table schema definition
  static readonly schema = {
    orderId: 'string',          // ULID - Primary Key
    userId: 'string',           // GSI1 Partition Key
    status: 'string',           // GSI2 Partition Key
    totalAmount: 'number',      // Total order amount in cents/paise
    paidAmount: 'number',       // Amount debited from wallet
    refundAmount: 'number',     // Amount refunded due to partial fulfillment
    items: 'list',              // Array of order items
    fulfillmentDetails: 'map',  // Fulfillment information
    createdAt: 'string',        // ISO timestamp - GSI Sort Key
    updatedAt: 'string'         // ISO timestamp
  };
  
  // Order item schema
  static readonly itemSchema = {
    variantId: 'string',
    productId: 'string',
    productName: 'string',
    variantName: 'string',
    unitPrice: 'number',
    requestedQuantity: 'number',
    fulfilledQuantity: 'number',
    totalPrice: 'number',
    fulfilledPrice: 'number',
    refundedPrice: 'number'
  };
  
  // Fulfillment details schema
  static readonly fulfillmentSchema = {
    attemptedAt: 'string',      // Optional
    fulfilledAt: 'string',      // Optional
    partialFulfillment: 'boolean',
    refundProcessed: 'boolean'
  };
  
  // Default values
  static readonly defaults = {
    status: 'PENDING',
    refundAmount: 0,
    fulfillmentDetails: {
      partialFulfillment: false,
      refundProcessed: false
    }
  };
  
  // Validation rules
  static readonly validation = {
    status: {
      required: true,
      enum: ['PENDING', 'PROCESSING', 'PARTIALLY_FULFILLED', 'FULFILLED', 'CANCELLED', 'REFUNDED']
    },
    totalAmount: {
      required: true,
      min: 1
    },
    items: {
      required: true,
      type: 'array',
      minItems: 1
    }
  };
  
  // Transform DB item to Order interface
  static toOrder(item: any): Order {
    return {
      orderId: item.orderId,
      userId: item.userId,
      status: item.status,
      totalAmount: item.totalAmount,
      paidAmount: item.paidAmount,
      refundAmount: item.refundAmount || 0,
      items: item.items || [],
      fulfillmentDetails: item.fulfillmentDetails,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }
} 