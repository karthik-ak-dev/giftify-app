import { orderRepository } from '../../repositories/orderRepository';
import { cartRepository } from '../../repositories/cartRepository';
import { userRepository } from '../../repositories/userRepository';
import { walletTransactionRepository } from '../../repositories/walletTransactionRepository';
import { productVariantRepository } from '../../repositories/productVariantRepository';
import { giftCardRepository } from '../../repositories/giftCardRepository';
import { CreateOrderRequest, Order } from '../../types/order';
import { AppError } from '../../middleware/errorHandler';
import { formatCurrency } from '../../utils/currency';
import { decrypt } from '../../utils/crypto';
import { APP_CONSTANTS } from '../../config/constants';
import { ulid } from 'ulid';

/**
 * Validates gift card availability for cart items
 */
const validateGiftCardAvailability = async (cartItems: any[]): Promise<{ availableItems: any[], unavailableItems: any[] }> => {
  const availableItems: any[] = [];
  const unavailableItems: any[] = [];

  for (const item of cartItems) {
    const variant = await productVariantRepository.findById(item.variantId);
    
    if (!variant) {
      unavailableItems.push({
        ...item,
        reason: 'Product variant not found'
      });
      continue;
    }

    if (!variant.isActive) {
      unavailableItems.push({
        ...item,
        reason: 'Product variant is inactive'
      });
      continue;
    }

    // Check available gift cards for this variant
    const availableGiftCards = await giftCardRepository.findAvailableByVariant(item.variantId, item.quantity);
    
    if (availableGiftCards.length < item.quantity) {
      // Partial availability
      if (availableGiftCards.length > 0) {
        availableItems.push({
          ...item,
          quantity: availableGiftCards.length,
          totalPrice: variant.sellingPrice * availableGiftCards.length,
          originalQuantity: item.quantity,
          availableGiftCards
        });
        unavailableItems.push({
          ...item,
          quantity: item.quantity - availableGiftCards.length,
          totalPrice: variant.sellingPrice * (item.quantity - availableGiftCards.length),
          reason: `Only ${availableGiftCards.length} gift cards available, requested ${item.quantity}`
        });
      } else {
        unavailableItems.push({
          ...item,
          reason: 'No gift cards available'
        });
      }
    } else {
      // Fully available
      availableItems.push({
        ...item,
        availableGiftCards: availableGiftCards.slice(0, item.quantity)
      });
    }
  }

  return { availableItems, unavailableItems };
};

/**
 * Mark gift cards as used for fulfilled items
 */
const markGiftCardsAsUsed = async (orderId: string, userId: string, fulfilledItems: any[]): Promise<void> => {
  for (const item of fulfilledItems) {
    const giftCardIds = item.availableGiftCards.map((gc: any) => gc.giftCardId);
    await giftCardRepository.markAsUsedByOrder(giftCardIds, orderId, userId);
  }
};

/**
 * Processes refund for unfulfilled items
 */
const processRefund = async (userId: string, orderId: string, refundAmount: number): Promise<void> => {
  if (refundAmount <= 0) return;

  const user = await userRepository.findById(userId);
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

  const refundTransactionId = ulid();
  const now = new Date().toISOString();
  const newBalance = user.walletBalance + refundAmount;

  // Create refund transaction
  await walletTransactionRepository.create({
    userId,
    transactionId: refundTransactionId,
    type: APP_CONSTANTS.TRANSACTION_TYPES.REFUND,
    amount: refundAmount,
    balanceAfter: newBalance,
    description: `Refund for unavailable items - Order ${orderId}`,
    orderId,
    status: APP_CONSTANTS.TRANSACTION_STATUS.COMPLETED,
    createdAt: now,
    updatedAt: now
  });

  // Update user balance
  await userRepository.updateWalletBalance(userId, newBalance);
};

/**
 * Main order creation and fulfillment service
 */
export const createOrderService = async (userId: string, orderItems: CreateOrderRequest['items']): Promise<Order & { 
  fulfillmentDetails: {
    attemptedAt: string;
    partialFulfillment: boolean;
    refundProcessed: boolean;
    totalItemsRequested: number;
    totalItemsFulfilled: number;
    totalGiftCardsAllocated: number;
    fulfillmentSummary: {
      fulfilledAmount: number;
      fulfilledAmountFormatted: string;
      refundedAmount: number;
      refundedAmountFormatted: string;
      totalPaidAmount: number;
      totalPaidAmountFormatted: string;
    };
    giftCards: Array<{
      giftCardId: string;
      productName: string;
      variantName: string;
      denomination: number;
      giftCardNumber: string;
      giftCardPin: string;
      expiryTime: string;
      denominationFormatted: string;
    }>;
    unavailableItems: Array<{
      productName: string;
      variantName: string;
      requestedQuantity: number;
      reason: string;
      refundAmount: number;
      refundAmountFormatted: string;
    }>;
  };
}> => {
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
    throw new AppError(
      `Insufficient wallet balance. Required: ${formatCurrency(totalAmount)}, Available: ${formatCurrency(user.walletBalance)}`, 
      400, 
      'INSUFFICIENT_BALANCE'
    );
  }

  const orderId = ulid();
  const now = new Date().toISOString();

  try {
    // Step 1: Debit wallet for full amount
    const paymentTransactionId = ulid();
    const newBalance = user.walletBalance - totalAmount;
    
    await walletTransactionRepository.create({
      userId,
      transactionId: paymentTransactionId,
      type: APP_CONSTANTS.TRANSACTION_TYPES.DEBIT,
      amount: totalAmount,
      balanceAfter: newBalance,
      description: `Order payment - ${orderId}`,
      orderId,
      status: APP_CONSTANTS.TRANSACTION_STATUS.COMPLETED,
      createdAt: now,
      updatedAt: now
    });

    await userRepository.updateWalletBalance(userId, newBalance);

    // Step 2: Validate gift card availability
    const { availableItems, unavailableItems } = await validateGiftCardAvailability(cart.items);
    
    // Step 3: Calculate fulfillment amounts
    const totalFulfilled = availableItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalUnfulfilled = unavailableItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Step 4: Mark gift cards as used for fulfilled items
    await markGiftCardsAsUsed(orderId, userId, availableItems);
    
    // Step 5: Process refund for unfulfilled items
    if (totalUnfulfilled > 0) {
      await processRefund(userId, orderId, totalUnfulfilled);
    }
    
    // Step 6: Determine order status
    let orderStatus: string;
    if (availableItems.length === 0) {
      orderStatus = APP_CONSTANTS.ORDER_STATUS.FAILED;
    } else if (unavailableItems.length === 0) {
      orderStatus = APP_CONSTANTS.ORDER_STATUS.FULFILLED;
    } else {
      orderStatus = APP_CONSTANTS.ORDER_STATUS.PARTIALLY_FULFILLED;
    }

    // Step 7: Create order record
    const orderData = {
      orderId,
      userId,
      status: orderStatus,
      totalAmount,
      paidAmount: totalAmount,
      refundAmount: totalUnfulfilled,
      items: cart.items.map(item => {
        const fulfilledItem = availableItems.find(ai => ai.variantId === item.variantId);
        const fulfilledQuantity = fulfilledItem ? fulfilledItem.quantity : 0;
        const fulfilledPrice = fulfilledItem ? fulfilledItem.totalPrice : 0;
        
        return {
          variantId: item.variantId,
          productId: item.productId,
          productName: item.productName,
          variantName: item.variantName,
          unitPrice: item.unitPrice,
          requestedQuantity: item.quantity,
          fulfilledQuantity,
          totalPrice: item.totalPrice,
          fulfilledPrice,
          refundedPrice: item.totalPrice - fulfilledPrice
        };
      }),
      fulfillmentDetails: {
        attemptedAt: now,
        partialFulfillment: unavailableItems.length > 0 ? true : false,
        refundProcessed: totalUnfulfilled > 0 ? true : false,
      },
      createdAt: now,
      updatedAt: now
    };

    const order = await orderRepository.create(orderData);

    // Step 8: Get gift cards used for this order
    const usedGiftCards = await giftCardRepository.findByOrderId(orderId);

    // Step 9: Clear cart
    await cartRepository.delete(userId);

    // Step 10: Return comprehensive order details
    const totalGiftCardsAllocated = usedGiftCards.length;

    return {
      ...order,
      fulfillmentDetails: {
        attemptedAt: now,
        partialFulfillment: unavailableItems.length > 0,
        refundProcessed: totalUnfulfilled > 0,
        totalItemsRequested: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        totalItemsFulfilled: availableItems.reduce((sum, item) => sum + item.quantity, 0),
        totalGiftCardsAllocated,
        fulfillmentSummary: {
          fulfilledAmount: totalFulfilled,
          fulfilledAmountFormatted: formatCurrency(totalFulfilled),
          refundedAmount: totalUnfulfilled,
          refundedAmountFormatted: formatCurrency(totalUnfulfilled),
          totalPaidAmount: totalAmount,
          totalPaidAmountFormatted: formatCurrency(totalAmount)
        },
        giftCards: usedGiftCards.map((gc: any) => ({
          giftCardId: gc.giftCardId,
          productName: gc.productName,
          variantName: gc.variantName,
          denomination: gc.denomination,
          giftCardNumber: decrypt(gc.giftCardNumber),
          giftCardPin: decrypt(gc.giftCardPin),
          expiryTime: gc.expiryTime,
          denominationFormatted: formatCurrency(gc.denomination * 100) // Convert rupees to paise for formatting
        })),
        unavailableItems: unavailableItems.map(item => ({
          productName: item.productName,
          variantName: item.variantName,
          requestedQuantity: item.quantity,
          reason: item.reason,
          refundAmount: item.totalPrice,
          refundAmountFormatted: formatCurrency(item.totalPrice)
        }))
      }
    };

  } catch (error) {
    // If anything fails after payment, attempt to refund the full amount and release allocated cards
    try {
      const fullRefundTransactionId = ulid();
      await walletTransactionRepository.create({
        userId,
        transactionId: fullRefundTransactionId,
        type: APP_CONSTANTS.TRANSACTION_TYPES.REFUND,
        amount: totalAmount,
        balanceAfter: user.walletBalance, // Restore original balance
        description: `Full refund - Order creation failed - ${orderId}`,
        orderId,
        status: APP_CONSTANTS.TRANSACTION_STATUS.COMPLETED,
        createdAt: now,
        updatedAt: now
      });
      
      await userRepository.updateWalletBalance(userId, user.walletBalance);
      
      // Release any used gift cards back to available
      await giftCardRepository.releaseGiftCards(orderId);
    } catch (refundError) {
      console.error('Critical: Failed to refund and release cards after order creation failure:', refundError);
      // In production, this should trigger an alert for manual intervention
    }
    
    throw error instanceof AppError ? error : new AppError('Order creation failed', 500, 'ORDER_CREATION_FAILED');
  }
}; 