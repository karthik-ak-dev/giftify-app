import { orderRepository } from '../../repositories/orderRepository';
import { Order } from '../../types/order';
import { AppError } from '../../middleware/errorHandler';

export const getOrderByIdService = async (orderId: string, userId: string): Promise<Order> => {
  const order = await orderRepository.findById(orderId);
  
  if (!order) {
    throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
  }

  if (order.userId !== userId) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  return order;
}; 