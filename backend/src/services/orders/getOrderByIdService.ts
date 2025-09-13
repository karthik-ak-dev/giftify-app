import { orderRepository } from '../../repositories/orderRepository';
import { userRepository } from '../../repositories/userRepository';
import { OrderResponse } from '../../types/order';
import { AppError } from '../../middleware/errorHandler';
import { transformOrderToResponse, validateOrderAccess } from './orderHelper';

export const getOrderByIdService = async (orderId: string, userId: string): Promise<OrderResponse> => {
  try {
    // Use shared validation logic
    const { order } = await validateOrderAccess(orderId, userId, userRepository, orderRepository);

    // Transform order to enhanced response format using shared helper
    return transformOrderToResponse(order);

  } catch (error) {
    // Re-throw AppErrors
    if (error instanceof AppError) {
      throw error;
    }

    // Handle validation errors from helper
    if (error instanceof Error) {
      if (error.message.includes('User ID are required')) {
        throw new AppError('Order ID and User ID are required', 400, 'MISSING_PARAMETERS');
      }
      if (error.message.includes('User not found')) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }
      if (error.message.includes('User account is inactive')) {
        throw new AppError('User account is inactive', 403, 'USER_INACTIVE');
      }
      if (error.message.includes('Order not found')) {
        throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
      }
      if (error.message.includes('Access denied')) {
        throw new AppError('Access denied - Order does not belong to user', 403, 'ACCESS_DENIED');
      }
    }

    // Handle repository errors
    if (error instanceof Error && error.message.includes('not found')) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    // Handle any other unexpected errors
    if (error instanceof Error) {
      throw new AppError(`Failed to get order: ${error.message}`, 500, 'ORDER_FETCH_FAILED');
    }

    throw new AppError('Failed to get order', 500, 'ORDER_FETCH_FAILED');
  }
}; 