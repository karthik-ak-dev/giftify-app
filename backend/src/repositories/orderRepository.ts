import { PutCommand, GetCommand, DeleteCommand, ScanCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Order, OrderStatus, ORDER_TABLE, USER_ORDERS_GSI, ORDER_STATUS_GSI } from '../models/OrderModel';
import { PaginationParams, PaginatedResponse } from '../types/api';
import { docClient } from '../utils/database';

export class OrderRepository {
  async create(order: Order): Promise<Order> {
    const command = new PutCommand({
      TableName: ORDER_TABLE,
      Item: order,
      ConditionExpression: 'attribute_not_exists(orderId)' // Prevent overwriting existing order
    });
    
    try {
      await docClient.send(command);
      return order;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Order already exists');
      }
      throw error;
    }
  }

  async findById(orderId: string): Promise<Order | null> {
    const command = new GetCommand({
      TableName: ORDER_TABLE,
      Key: { orderId }
    });
    
    const result = await docClient.send(command);
    return result.Item ? new Order(result.Item as any) : null;
  }

  async findByUserId(
    userId: string,
    options: PaginationParams & { status?: string }
  ): Promise<PaginatedResponse<Order>> {
    const { page = 1, limit = 10, status } = options;
    
    let items: any[] = [];
    
    if (status) {
      // Get orders by status first, then filter by userId
      const statusCommand = new QueryCommand({
        TableName: ORDER_TABLE,
        IndexName: ORDER_STATUS_GSI,
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': status
        }
      });
      
      const statusResult = await docClient.send(statusCommand);
      items = (statusResult.Items || []).filter(item => item.userId === userId);
    } else {
      // Get all orders for user using GSI
      const userCommand = new QueryCommand({
        TableName: ORDER_TABLE,
        IndexName: USER_ORDERS_GSI,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false // Sort by createdAt descending
      });
      
      const userResult = await docClient.send(userCommand);
      items = userResult.Items || [];
    }

    // Sort by createdAt descending if not already sorted
    if (status) {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

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
    const command = new QueryCommand({
      TableName: ORDER_TABLE,
      IndexName: ORDER_STATUS_GSI,
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status
      },
      ScanIndexForward: false // Most recent first
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new Order(item as any));
  }

  async save(order: Order): Promise<Order> {
    const command = new PutCommand({
      TableName: ORDER_TABLE,
      Item: order
    });
    
    await docClient.send(command);
    return order;
  }

  async updateStatus(order: Order, status: OrderStatus): Promise<Order> {
    order.updateStatus(status);
    
    const command = new UpdateCommand({
      TableName: ORDER_TABLE,
      Key: { orderId: order.orderId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': order.status,
        ':updatedAt': order.updatedAt
      },
      ConditionExpression: 'attribute_exists(orderId)' // Ensure order exists
    });
    
    try {
      await docClient.send(command);
      return order;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Order not found');
      }
      throw error;
    }
  }

  async markAsProcessing(order: Order): Promise<Order> {
    order.markAsProcessing();
    
    const command = new UpdateCommand({
      TableName: ORDER_TABLE,
      Key: { orderId: order.orderId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': order.status,
        ':updatedAt': order.updatedAt,
        ':pendingStatus': OrderStatus.PENDING
      },
      ConditionExpression: '#status = :pendingStatus' // Only allow from PENDING
    });
    
    // Add pending status to condition
    command.input.ExpressionAttributeValues![':pendingStatus'] = OrderStatus.PENDING;
    
    try {
      await docClient.send(command);
      return order;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Order cannot be marked as processing - invalid current status');
      }
      throw error;
    }
  }

  async markAsFulfilled(order: Order, fulfillmentDetails?: any): Promise<Order> {
    order.markAsFulfilled(fulfillmentDetails);
    
    const command = new UpdateCommand({
      TableName: ORDER_TABLE,
      Key: { orderId: order.orderId },
      UpdateExpression: 'SET #status = :status, fulfillmentDetails = :fulfillmentDetails, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': order.status,
        ':fulfillmentDetails': order.fulfillmentDetails,
        ':updatedAt': order.updatedAt
      }
    });
    
    await docClient.send(command);
    return order;
  }

  async markAsPartiallyFulfilled(order: Order, refundAmount: number, fulfillmentDetails?: any): Promise<Order> {
    order.markAsPartiallyFulfilled(refundAmount, fulfillmentDetails);
    
    const command = new UpdateCommand({
      TableName: ORDER_TABLE,
      Key: { orderId: order.orderId },
      UpdateExpression: 'SET #status = :status, refundAmount = :refundAmount, fulfillmentDetails = :fulfillmentDetails, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': order.status,
        ':refundAmount': order.refundAmount,
        ':fulfillmentDetails': order.fulfillmentDetails,
        ':updatedAt': order.updatedAt
      }
    });
    
    await docClient.send(command);
    return order;
  }

  async markAsFailed(order: Order, refundAmount?: number): Promise<Order> {
    order.markAsFailed(refundAmount);
    
    const command = new UpdateCommand({
      TableName: ORDER_TABLE,
      Key: { orderId: order.orderId },
      UpdateExpression: 'SET #status = :status, refundAmount = :refundAmount, fulfillmentDetails = :fulfillmentDetails, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': order.status,
        ':refundAmount': order.refundAmount,
        ':fulfillmentDetails': order.fulfillmentDetails,
        ':updatedAt': order.updatedAt
      }
    });
    
    await docClient.send(command);
    return order;
  }

  async cancel(order: Order): Promise<Order> {
    order.cancel();
    
    const command = new UpdateCommand({
      TableName: ORDER_TABLE,
      Key: { orderId: order.orderId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': order.status,
        ':updatedAt': order.updatedAt,
        ':fulfilledStatus': OrderStatus.FULFILLED
      },
      ConditionExpression: '#status <> :fulfilledStatus' // Cannot cancel fulfilled orders
    });
    
    // Add fulfilled status to condition
    command.input.ExpressionAttributeValues![':fulfilledStatus'] = OrderStatus.FULFILLED;
    
    try {
      await docClient.send(command);
      return order;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Cannot cancel a fulfilled order');
      }
      throw error;
    }
  }

  // Business query methods with optimized queries
  async findPendingOrders(): Promise<Order[]> {
    return this.findByStatus(OrderStatus.PENDING);
  }

  async findProcessingOrders(): Promise<Order[]> {
    return this.findByStatus(OrderStatus.PROCESSING);
  }

  async findCompletedOrders(): Promise<Order[]> {
    const [fulfilled, partiallyFulfilled, failed] = await Promise.all([
      this.findByStatus(OrderStatus.FULFILLED),
      this.findByStatus(OrderStatus.PARTIALLY_FULFILLED),
      this.findByStatus(OrderStatus.FAILED)
    ]);
    
    return [...fulfilled, ...partiallyFulfilled, ...failed]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findOrdersWithRefunds(): Promise<Order[]> {
    const command = new ScanCommand({
      TableName: ORDER_TABLE,
      FilterExpression: 'refundAmount > :zero',
      ExpressionAttributeValues: {
        ':zero': 0
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new Order(item as any));
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
    const command = new ScanCommand({
      TableName: ORDER_TABLE
    });
    
    const result = await docClient.send(command);
    const orders = (result.Items || []).map(item => new Order(item as any));
    
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

  // Advanced query methods
  async findOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    const command = new ScanCommand({
      TableName: ORDER_TABLE,
      FilterExpression: 'createdAt BETWEEN :startDate AND :endDate',
      ExpressionAttributeValues: {
        ':startDate': startDate,
        ':endDate': endDate
      }
    });
    
    const result = await docClient.send(command);
    const orders = (result.Items || []).map(item => new Order(item as any));
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findOrdersByAmountRange(minAmount: number, maxAmount: number): Promise<Order[]> {
    const command = new ScanCommand({
      TableName: ORDER_TABLE,
      FilterExpression: 'totalAmount BETWEEN :minAmount AND :maxAmount',
      ExpressionAttributeValues: {
        ':minAmount': minAmount,
        ':maxAmount': maxAmount
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new Order(item as any));
  }

  async delete(order: Order): Promise<void> {
    const command = new DeleteCommand({
      TableName: ORDER_TABLE,
      Key: { orderId: order.orderId },
      ConditionExpression: '#status IN (:pending, :cancelled, :failed)', // Only allow deleting non-fulfilled orders
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':pending': OrderStatus.PENDING,
        ':cancelled': OrderStatus.CANCELLED,
        ':failed': OrderStatus.FAILED
      }
    });
    
    try {
      await docClient.send(command);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Cannot delete fulfilled or processing orders');
      }
      throw error;
    }
  }
}

export const orderRepository = new OrderRepository(); 