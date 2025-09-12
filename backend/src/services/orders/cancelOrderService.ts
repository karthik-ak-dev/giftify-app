import { orderRepository } from '../../repositories/orderRepository';
import { walletTransactionRepository } from '../../repositories/walletTransactionRepository';
import { userRepository } from '../../repositories/userRepository';
import { AppError } from '../../middleware/errorHandler';
import { ulid } from 'ulid';

export const cancelOrderService = async (orderId: string, userId: string) => {
  const order = await orderRepository.findById(orderId);
  
  if (!order) {
    throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
  }

  if (order.userId !== userId) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  if (order.status !== 'PENDING') {
    throw new AppError('Order cannot be cancelled', 400, 'CANNOT_CANCEL');
  }

  // Get user for wallet refund
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Refund the full amount
  const transactionId = ulid();
  const now = new Date().toISOString();
  const newBalance = user.walletBalance + order.paidAmount;

  await walletTransactionRepository.create({
    userId,
    transactionId,
    type: 'REFUND',
    amount: order.paidAmount,
    balanceAfter: newBalance,
    description: `Order cancellation - ${orderId}`,
    orderId,
    status: 'COMPLETED',
    createdAt: now,
    updatedAt: now
  });

  await userRepository.updateWalletBalance(userId, newBalance);

  // Update order status
  await orderRepository.update(orderId, {
    status: 'CANCELLED',
    refundAmount: order.paidAmount,
    updatedAt: now
  });

  return {
    orderId,
    status: 'CANCELLED',
    refundAmount: order.paidAmount,
    message: 'Order cancelled and refund processed'
  };
}; 