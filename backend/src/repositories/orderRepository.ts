import { OrderModel } from '../models/OrderModel';
import { Order } from '../types/order';
import { PaginationParams, PaginatedResponse } from '../types/api';
import { db } from '../utils/database';

export class OrderRepository {
  async create(orderData: any): Promise<Order> {
    const item = await db.put(OrderModel.tableName, orderData);
    return OrderModel.toOrder(item);
  }

  async findById(orderId: string): Promise<Order | null> {
    const item = await db.get(OrderModel.tableName, { orderId });
    return item ? OrderModel.toOrder(item) : null;
  }

  async findByUserId(
    userId: string,
    options: PaginationParams & { status?: string }
  ): Promise<PaginatedResponse<Order>> {
    const { page = 1, limit = 10, status } = options;
    
    let items: any[];
    
    if (status) {
      // Get orders by status first, then filter by userId
      const statusItems = await db.queryGSI(
        OrderModel.tableName,
        OrderModel.orderStatusGSI,
        OrderModel.orderStatusGSIPartitionKey,
        status
      );
      items = statusItems.filter(item => item.userId === userId);
    } else {
      // Get all orders for user
      items = await db.queryGSI(
        OrderModel.tableName,
        OrderModel.userOrdersGSI,
        OrderModel.userOrdersGSIPartitionKey,
        userId
      );
    }

    // Sort by createdAt descending
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    const totalPages = Math.ceil(items.length / limit);
    
    return {
      items: paginatedItems.map(item => OrderModel.toOrder(item)),
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

  async update(orderId: string, updateData: any): Promise<Order> {
    const updatedItem = await db.update(OrderModel.tableName, { orderId }, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    return OrderModel.toOrder(updatedItem);
  }

  async findByStatus(status: string): Promise<Order[]> {
    const items = await db.queryGSI(
      OrderModel.tableName,
      OrderModel.orderStatusGSI,
      OrderModel.orderStatusGSIPartitionKey,
      status
    );
    return items.map(item => OrderModel.toOrder(item));
  }
}

export const orderRepository = new OrderRepository(); 