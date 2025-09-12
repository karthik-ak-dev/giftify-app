import { orderRepository } from '../../repositories/orderRepository';
import { cartRepository } from '../../repositories/cartRepository';
import { userRepository } from '../../repositories/userRepository';
import { walletTransactionRepository } from '../../repositories/walletTransactionRepository';
import { CreateOrderRequest, Order } from '../../types/order';
import { AppError } from '../../middleware/errorHandler';
import { ulid } from 'ulid';

export const createOrderService = async (userId: string, orderItems: CreateOrderRequest['items']): Promise<Order> => {
  // Get and validate cart
  const cart = await cartRepository.findByUserId(userId);
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400, 'EMPTY_CART');
  }
  
  // Calculate total amount
  const totalAmount = cart.totalAmount;
  
  // Check wallet balance
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  
  if (user.walletBalance < totalAmount) {
    throw new AppError('Insufficient wallet balance', 400, 'INSUFFICIENT_BALANCE');
  }

  const orderId = ulid();
  const now = new Date().toISOString();

  try {
    // Debit wallet
    const transactionId = ulid();
    const newBalance = user.walletBalance - totalAmount;
    
    await walletTransactionRepository.create({
      userId,
      transactionId,
      type: 'DEBIT',
      amount: totalAmount,
      balanceAfter: newBalance,
      description: `Order payment - ${orderId}`,
      orderId,
      status: 'COMPLETED',
      createdAt: now,
      updatedAt: now
    });

    await userRepository.updateWalletBalance(userId, newBalance);

    // Create order
    const order = await orderRepository.create({
      orderId,
      userId,
      status: 'PROCESSING',
      totalAmount,
      paidAmount: totalAmount,
      refundAmount: 0,
      items: cart.items.map(item => ({
        variantId: item.variantId,
        productId: item.productId,
        productName: item.productName,
        variantName: item.variantName,
        unitPrice: item.unitPrice,
        requestedQuantity: item.quantity,
        fulfilledQuantity: 0,
        totalPrice: item.totalPrice,
        fulfilledPrice: 0,
        refundedPrice: 0
      })),
      fulfillmentDetails: {
        attemptedAt: now,
        partialFulfillment: false,
        refundProcessed: false
      },
      createdAt: now,
      updatedAt: now
    });

    // Clear cart
    await cartRepository.delete(userId);

    return order;
  } catch (error) {
    // If order creation fails, refund the wallet
    try {
      const refundTransactionId = ulid();
      await walletTransactionRepository.create({
        userId,
        transactionId: refundTransactionId,
        type: 'REFUND',
        amount: totalAmount,
        balanceAfter: user.walletBalance,
        description: `Order creation failed - ${orderId}`,
        orderId,
        status: 'COMPLETED',
        createdAt: now,
        updatedAt: now
      });
    } catch (refundError) {
      console.error('Failed to refund wallet after order creation failure:', refundError);
    }
    
    throw error;
  }
}; 