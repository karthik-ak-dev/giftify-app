import { orderRepository } from '../../repositories/orderRepository';
import { userRepository } from '../../repositories/userRepository';
import { PaginatedResponse } from '../../types/api';
import { OrderResponse } from '../../types/order';
import { AppError } from '../../middleware/errorHandler';
import { transformOrderToResponse, validateUserAccess } from './orderHelper';

export const getOrdersService = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<OrderResponse>> => {
  try {
    // Use shared user validation logic
    await validateUserAccess(userId, userRepository);

    // Validate pagination parameters
    if (page < 1) {
      throw new AppError('Page number must be greater than 0', 400, 'INVALID_PAGE');
    }

    if (limit < 1 || limit > 100) {
      throw new AppError('Limit must be between 1 and 100', 400, 'INVALID_LIMIT');
    }

    // Get orders for user with pagination (orders are returned in desc order by creation date)
    const result = await orderRepository.findByUserId(userId, { page, limit });

    // Convert orders to enhanced response format using shared helper
    const enhancedOrders: OrderResponse[] = result.items.map(order => transformOrderToResponse(order));

    return {
      items: enhancedOrders,
      pagination: result.pagination
    };

  } catch (error) {
    // Re-throw AppErrors
    if (error instanceof AppError) {
      throw error;
    }

    // Handle validation errors from helper
    if (error instanceof Error) {
      if (error.message.includes('User ID is required')) {
        throw new AppError('User ID is required', 400, 'MISSING_USER_ID');
      }
      if (error.message.includes('User not found')) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }
      if (error.message.includes('User account is inactive')) {
        throw new AppError('User account is inactive', 403, 'USER_INACTIVE');
      }
    }

    // Handle repository errors
    if (error instanceof Error && error.message.includes('not found')) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Handle any other unexpected errors
    if (error instanceof Error) {
      throw new AppError(`Failed to get orders: ${error.message}`, 500, 'ORDERS_FETCH_FAILED');
    }

    throw new AppError('Failed to get orders', 500, 'ORDERS_FETCH_FAILED');
  }
}; 