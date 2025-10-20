import { PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Order, OrderStatus, ORDER_TABLE, USER_ORDERS_GSI, ORDER_STATUS_GSI } from '../models/OrderModel';
import { PaginationParams, PaginatedResponse } from '../types/api';
import { docClient } from '../utils/database';

export class OrderRepository {
  async create(order: Order): Promise<Order> {
    const command = new PutCommand({
      TableName: ORDER_TABLE,
      Item: order,
      ConditionExpression: 'attribute_not_exists(orderId)'
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
      const userCommand = new QueryCommand({
        TableName: ORDER_TABLE,
        IndexName: USER_ORDERS_GSI,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      });
      
      const userResult = await docClient.send(userCommand);
      items = userResult.Items || [];
    }

    if (status) {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

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

  async save(order: Order): Promise<Order> {
    const command = new PutCommand({
      TableName: ORDER_TABLE,
      Item: order
    });
    
    await docClient.send(command);
    return order;
  }
}

export const orderRepository = new OrderRepository();
