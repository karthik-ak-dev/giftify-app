import { Order, OrderStatus, ORDER_TABLE, USER_ORDERS_GSI, ORDER_STATUS_GSI } from '../models/OrderModel';
import { PaginationParams, PaginatedResponse } from '../types/api';
import { db } from '../utils/database';

export class OrderRepository {
  async create(order: Order): Promise<Order> {
    await db.put(ORDER_TABLE, order);
    return order;
  }

  async findById(orderId: string): Promise<Order | null> {
    const item = await db.get(ORDER_TABLE, { orderId });
    return item ? new Order(item as any) : null;
  }

  async findByUserId(
    userId: string,
    options: PaginationParams & { status?: string }
  ): Promise<PaginatedResponse<Order>> {
    const { page = 1, limit = 10, status } = options;
    
    let items: any[];
    
    if (status) {
      // Get orders by status first, then filter by userId
      const statusItems = await db.queryGSI(ORDER_TABLE, ORDER_STATUS_GSI, 'status', status);
      items = statusItems.filter(item => item.userId === userId);
    } else {
      // Get all orders for user
      items = await db.queryGSI(ORDER_TABLE, USER_ORDERS_GSI, 'userId', userId);
    }

    // Sort by createdAt descending
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    const totalPages = Math.ceil(items.length / limit);
    
    return {
      items: paginatedItems.map(item => new Order(item as any)),
      pagination: {
        page,
        limit,
        total: items.length,
        totalPages,
        hasNext: endIndex < items.length,
        hasPrev: page > 1
      }
    };
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const items = await db.queryGSI(ORDER_TABLE, ORDER_STATUS_GSI, 'status', status);
    return items.map(item => new Order(item as any));
  }

  async save(order: Order): Promise<Order> {
    await db.put(ORDER_TABLE, order);
    return order;
  }

  async updateStatus(order: Order, status: OrderStatus): Promise<Order> {
    order.updateStatus(status);
    await db.update(ORDER_TABLE, { orderId: order.orderId }, {
      status: order.status,
      updatedAt: order.updatedAt
    });
    return order;
  }

  async markAsProcessing(order: Order): Promise<Order> {
    order.markAsProcessing();
    await db.update(ORDER_TABLE, { orderId: order.orderId }, {
      status: order.status,
      updatedAt: order.updatedAt
    });
    return order;
  }

  async markAsFulfilled(order: Order, fulfillmentDetails?: any): Promise<Order> {
    order.markAsFulfilled(fulfillmentDetails);
    await db.update(ORDER_TABLE, { orderId: order.orderId }, {
      status: order.status,
      fulfillmentDetails: order.fulfillmentDetails,
      updatedAt: order.updatedAt
    });
    return order;
  }

  async markAsPartiallyFulfilled(order: Order, refundAmount: number, fulfillmentDetails?: any): Promise<Order> {
    order.markAsPartiallyFulfilled(refundAmount, fulfillmentDetails);
    await db.update(ORDER_TABLE, { orderId: order.orderId }, {
      status: order.status,
      refundAmount: order.refundAmount,
      fulfillmentDetails: order.fulfillmentDetails,
      updatedAt: order.updatedAt
    });
    return order;
  }

  async markAsFailed(order: Order, refundAmount?: number): Promise<Order> {
    order.markAsFailed(refundAmount);
    await db.update(ORDER_TABLE, { orderId: order.orderId }, {
      status: order.status,
      refundAmount: order.refundAmount,
      fulfillmentDetails: order.fulfillmentDetails,
      updatedAt: order.updatedAt
    });
    return order;
  }

  async cancel(order: Order): Promise<Order> {
    order.cancel();
    await db.update(ORDER_TABLE, { orderId: order.orderId }, {
      status: order.status,
      updatedAt: order.updatedAt
    });
    return order;
  }

  // Business query methods
  async findPendingOrders(): Promise<Order[]> {
    return this.findByStatus(OrderStatus.PENDING);
  }

  async findProcessingOrders(): Promise<Order[]> {
    return this.findByStatus(OrderStatus.PROCESSING);
  }

  async findCompletedOrders(): Promise<Order[]> {
    const fulfilled = await this.findByStatus(OrderStatus.FULFILLED);
    const partiallyFulfilled = await this.findByStatus(OrderStatus.PARTIALLY_FULFILLED);
    const failed = await this.findByStatus(OrderStatus.FAILED);
    
    return [...fulfilled, ...partiallyFulfilled, ...failed]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findOrdersWithRefunds(): Promise<Order[]> {
    // Scan for orders with refund amount > 0
    const items = await db.scan(ORDER_TABLE, {
      FilterExpression: 'refundAmount > :zero',
      ExpressionAttributeValues: {
        ':zero': 0
      }
    });
    return items.map(item => new Order(item as any));
  }

  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    fulfilled: number;
    partiallyFulfilled: number;
    failed: number;
    cancelled: number;
  }> {
    const allOrders = await db.scan(ORDER_TABLE, {});
    const orders = allOrders.map(item => new Order(item as any));
    
    const stats = {
      total: orders.length,
      pending: 0,
      processing: 0,
      fulfilled: 0,
      partiallyFulfilled: 0,
      failed: 0,
      cancelled: 0
    };
    
    orders.forEach(order => {
      switch (order.status) {
        case OrderStatus.PENDING:
          stats.pending++;
          break;
        case OrderStatus.PROCESSING:
          stats.processing++;
          break;
        case OrderStatus.FULFILLED:
          stats.fulfilled++;
          break;
        case OrderStatus.PARTIALLY_FULFILLED:
          stats.partiallyFulfilled++;
          break;
        case OrderStatus.FAILED:
          stats.failed++;
          break;
        case OrderStatus.CANCELLED:
          stats.cancelled++;
          break;
      }
    });
    
    return stats;
  }

  async delete(order: Order): Promise<void> {
    await db.delete(ORDER_TABLE, { orderId: order.orderId });
  }
}

export const orderRepository = new OrderRepository(); 