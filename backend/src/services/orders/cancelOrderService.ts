import { orderRepository } from '../../repositories/orderRepository';
import { walletTransactionRepository } from '../../repositories/walletTransactionRepository';
import { userRepository } from '../../repositories/userRepository';
import { giftCardRepository } from '../../repositories/giftCardRepository';
import { Order, OrderStatus } from '../../models/OrderModel';
import { WalletTransaction, TransactionType, TransactionStatus } from '../../models/WalletTransactionModel';
import { CancelOrderResponse } from '../../types/order';
import { AppError } from '../../middleware/errorHandler';
import { formatCurrency } from '../../utils/currency';

export const cancelOrderService = async (orderId: string, userId: string): Promise<CancelOrderResponse> => {
  try {
    // Validate input parameters
    if (!orderId || !userId) {
      throw new AppError('Order ID and User ID are required', 400, 'MISSING_PARAMETERS');
    }

    // Find order by ID
    const order = await orderRepository.findById(orderId);
    
    if (!order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    // Verify order ownership
    if (order.userId !== userId) {
      throw new AppError('Access denied - Order does not belong to user', 403, 'ACCESS_DENIED');
    }

    // Check if order can be cancelled (only PENDING, PROCESSING, or PARTIALLY_FULFILLED orders)
    if (order.isFulfilled || order.isCancelled || order.isFailed) {
      throw new AppError(
        `Order cannot be cancelled. Current status: ${order.status}`, 
        400, 
        'CANNOT_CANCEL_ORDER'
      );
    }

    // Get user for wallet refund
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('User account is inactive', 403, 'USER_INACTIVE');
    }

    // Validate refund amount
    if (order.paidAmount <= 0) {
      throw new AppError('No amount to refund', 400, 'NO_REFUND_AMOUNT');
    }

    // Calculate new wallet balance
    const newBalance = user.walletBalance + order.paidAmount;

    // Validate new balance doesn't exceed maximum allowed
    const maxWalletBalance = 1000000 * 100; // 10 lakh rupees in paise
    if (newBalance > maxWalletBalance) {
      throw new AppError(
        'Refund would exceed maximum wallet balance limit', 
        400, 
        'WALLET_LIMIT_EXCEEDED'
      );
    }

    // Declare refundTransaction variable outside try block for error handling
    let refundTransaction: WalletTransaction | null = null;

    try {
      // Start transaction-like operations
      
      // 1. Create refund transaction using WalletTransaction model
      refundTransaction = WalletTransaction.create({
        userId,
        type: TransactionType.REFUND,
        amount: order.paidAmount,
        balanceAfter: newBalance,
        description: `Order cancellation refund - ${orderId}`,
        orderId
      });

      // Mark transaction as completed
      refundTransaction.markAsCompleted();

      // Create the transaction record
      const createdTransaction = await walletTransactionRepository.create(refundTransaction);

      // 2. Update user wallet balance using atomic operation
      const updatedUser = await userRepository.atomicWalletOperation(userId, order.paidAmount, 'ADD');

      // 3. Release any allocated gift cards back to available pool
      try {
        await giftCardRepository.releaseGiftCards(orderId);
      } catch (giftCardError) {
        // Log error but don't fail the cancellation
        console.warn(`Failed to release gift cards for order ${orderId}:`, giftCardError);
      }

      // 4. Cancel the order using Order model method
      order.cancel();
      
      // Add refund amount to the order
      order.refundAmount = order.paidAmount;
      
      // Save the updated order
      const cancelledOrder = await orderRepository.save(order);

      // Prepare enhanced response
      const response: CancelOrderResponse = {
        orderId: cancelledOrder.orderId,
        status: cancelledOrder.status,
        refundAmount: order.paidAmount,
        formattedRefundAmount: formatCurrency(order.paidAmount),
        transactionId: createdTransaction.transactionId,
        newWalletBalance: updatedUser.walletBalance,
        formattedNewWalletBalance: formatCurrency(updatedUser.walletBalance),
        message: 'Order cancelled successfully and refund processed',
        cancelledAt: cancelledOrder.updatedAt
      };

      return response;

    } catch (operationError) {
      // If any operation fails, try to mark the transaction as failed
      try {
        if (refundTransaction) {
          refundTransaction.markAsFailed();
          await walletTransactionRepository.updateStatus(refundTransaction, TransactionStatus.FAILED);
        }
      } catch (updateError) {
        console.error('Failed to mark refund transaction as failed:', updateError);
      }

      // Handle specific operation errors
      if (operationError instanceof Error) {
        if (operationError.message.includes('already exists')) {
          throw new AppError('Duplicate refund transaction detected', 409, 'DUPLICATE_REFUND');
        }
        if (operationError.message.includes('User not found')) {
          throw new AppError('User not found during refund', 404, 'USER_NOT_FOUND');
        }
        if (operationError.message.includes('Order not found')) {
          throw new AppError('Order not found during cancellation', 404, 'ORDER_NOT_FOUND');
        }
        if (operationError.message.includes('cannot be cancelled')) {
          throw new AppError('Order status changed during cancellation', 409, 'ORDER_STATUS_CHANGED');
        }
      }

      throw new AppError('Failed to cancel order and process refund', 500, 'CANCELLATION_FAILED');
    }

  } catch (error) {
    // Re-throw AppErrors
    if (error instanceof AppError) {
      throw error;
    }

    // Handle Order model validation errors
    if (error instanceof Error && (
      error.message.includes('Invalid status transition') ||
      error.message.includes('Order cannot be cancelled')
    )) {
      throw new AppError(`Order validation error: ${error.message}`, 400, 'ORDER_VALIDATION_ERROR');
    }

    // Handle WalletTransaction model validation errors
    if (error instanceof Error && (
      error.message.includes('required') ||
      error.message.includes('must be positive') ||
      error.message.includes('cannot be empty')
    )) {
      throw new AppError(`Transaction validation error: ${error.message}`, 400, 'TRANSACTION_VALIDATION_ERROR');
    }

    // Handle repository errors
    if (error instanceof Error && error.message.includes('not found')) {
      throw new AppError('Resource not found during cancellation', 404, 'RESOURCE_NOT_FOUND');
    }

    // Handle any other unexpected errors
    if (error instanceof Error) {
      throw new AppError(`Failed to cancel order: ${error.message}`, 500, 'ORDER_CANCELLATION_FAILED');
    }

    throw new AppError('Failed to cancel order', 500, 'ORDER_CANCELLATION_FAILED');
  }
}; 