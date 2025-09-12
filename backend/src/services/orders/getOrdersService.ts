import { orderRepository } from '../../repositories/orderRepository';
import { PaginationParams, PaginatedResponse } from '../../types/api';
import { Order } from '../../types/order';

export const getOrdersService = async (
  userId: string,
  options: PaginationParams & { status?: string }
): Promise<PaginatedResponse<Order>> => {
  return await orderRepository.findByUserId(userId, options);
}; 