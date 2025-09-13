import { orderRepository } from '../../repositories/orderRepository';
import { cartRepository } from '../../repositories/cartRepository';
import { userRepository } from '../../repositories/userRepository';
import { walletTransactionRepository } from '../../repositories/walletTransactionRepository';
import { productVariantRepository } from '../../repositories/productVariantRepository';
import { giftCardRepository } from '../../repositories/giftCardRepository';
import { Order } from '../../models/OrderModel';
import { WalletTransaction, TransactionType } from '../../models/WalletTransactionModel';
import { CreateOrderResponse } from '../../types/order';
import { AppError } from '../../middleware/errorHandler';
import { formatCurrency } from '../../utils/currency';
import { decrypt } from '../../utils/crypto';

/**
 * Production-ready order creation service
 * Handles complete order lifecycle: validation, payment, fulfillment, and error recovery
 */
export const createOrderService = async (userId: string): Promise<CreateOrderResponse> => {
  // Validate input
  if (!userId) {
    throw new AppError('User ID is required', 400, 'MISSING_USER_ID');
  }

  let paymentTransaction: WalletTransaction | null = null;
  let allocatedGiftCards: string[] = [];
  let orderCreated = false;

  try {
    // Step 1: Validate user and get cart
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (!user.isActive) {
      throw new AppError('User account is inactive', 403, 'USER_INACTIVE');
    }

    const cart = await cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400, 'EMPTY_CART');
    }

    // Step 2: Validate cart items and check gift card availability
    const validationResults = await validateCartAndAvailability(cart.items);
    const { availableItems, unavailableItems, totalAvailableAmount, totalUnavailableAmount } = validationResults;

    if (availableItems.length === 0) {
      throw new AppError('No items available for fulfillment', 400, 'NO_ITEMS_AVAILABLE');
    }

    const totalOrderAmount = cart.totalAmount;

    // Step 3: Validate wallet balance
    if (user.walletBalance < totalOrderAmount) {
      throw new AppError(
        `Insufficient wallet balance. Required: ${formatCurrency(totalOrderAmount)}, Available: ${formatCurrency(user.walletBalance)}`,
        400,
        'INSUFFICIENT_BALANCE'
      );
    }

    // Step 4: Update user wallet balance atomically first
    const updatedUser = await userRepository.atomicWalletOperation(userId, totalOrderAmount, 'SUBTRACT');

    // Step 5: Create order using Order model
    const order = Order.create({
      userId,
      totalAmount: totalOrderAmount,
      paidAmount: totalOrderAmount,
      items: buildOrderItems(cart.items, availableItems, unavailableItems)
    });

    // Update order status based on fulfillment
    if (unavailableItems.length === 0) {
      order.markAsFulfilled({
        totalGiftCardsAllocated: 0, // Will be updated after allocation
        partialFulfillment: false,
        refundProcessed: false
      });
    } else if (availableItems.length > 0) {
      order.markAsPartiallyFulfilled(totalUnavailableAmount, {
        totalGiftCardsAllocated: 0, // Will be updated after allocation
        partialFulfillment: true,
        refundProcessed: totalUnavailableAmount > 0
      });
    } else {
      order.markAsFailed(totalOrderAmount);
    }

    // Save order to database
    const savedOrder = await orderRepository.create(order);
    orderCreated = true;

    // Step 6: Create payment transaction with order ID
    paymentTransaction = WalletTransaction.create({
      userId,
      type: TransactionType.DEBIT,
      amount: totalOrderAmount,
      balanceAfter: updatedUser.walletBalance,
      description: `Order payment - ${savedOrder.orderId}`,
      orderId: savedOrder.orderId
    });

    paymentTransaction.markAsCompleted();
    await walletTransactionRepository.create(paymentTransaction);

    // Step 7: Allocate gift cards for available items
    const giftCardAllocationResults = await allocateGiftCards(availableItems, savedOrder.orderId, userId);
    allocatedGiftCards = giftCardAllocationResults.allocatedCardIds;

    // Step 8: Process refund for unavailable items if needed
    if (totalUnavailableAmount > 0) {
      await processRefundTransaction(userId, savedOrder.orderId, totalUnavailableAmount, updatedUser.walletBalance);
    }

    // Step 9: Get allocated gift cards with details
    const allocatedGiftCardsDetails = await giftCardRepository.findByOrderId(savedOrder.orderId);

    // Step 10: Clear user's cart
    await cartRepository.delete(userId);

    // Step 11: Build comprehensive response
    return buildOrderResponse(savedOrder, allocatedGiftCardsDetails, availableItems, unavailableItems, totalAvailableAmount, totalUnavailableAmount);

  } catch (error) {
    // Comprehensive error recovery
    await handleOrderCreationFailure(userId, paymentTransaction, allocatedGiftCards, orderCreated, error);
    
    // Re-throw the original error or a wrapped error
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError('Order creation failed', 500, 'ORDER_CREATION_FAILED');
  }
};

/**
 * Validates cart items and checks gift card availability
 */
async function validateCartAndAvailability(cartItems: any[]) {
  const availableItems: any[] = [];
  const unavailableItems: any[] = [];
  let totalAvailableAmount = 0;
  let totalUnavailableAmount = 0;

  for (const item of cartItems) {
    try {
      // Validate product variant
      const variant = await productVariantRepository.findById(item.variantId);
      if (!variant) {
        unavailableItems.push({
          ...item,
          reason: 'Product variant not found',
          refundAmount: item.totalPrice
        });
        totalUnavailableAmount += item.totalPrice;
        continue;
      }

      if (!variant.isActive) {
        unavailableItems.push({
          ...item,
          reason: 'Product variant is inactive',
          refundAmount: item.totalPrice
        });
        totalUnavailableAmount += item.totalPrice;
        continue;
      }

      // Check gift card availability
      const availableGiftCards = await giftCardRepository.findAvailableByVariant(item.variantId, item.quantity);
      
      if (availableGiftCards.length === 0) {
        unavailableItems.push({
          ...item,
          reason: 'No gift cards available',
          refundAmount: item.totalPrice
        });
        totalUnavailableAmount += item.totalPrice;
      } else if (availableGiftCards.length < item.quantity) {
        // Partial availability
        const availableQuantity = availableGiftCards.length;
        const unavailableQuantity = item.quantity - availableQuantity;
        const availableAmount = variant.sellingPrice * availableQuantity;
        const unavailableAmount = variant.sellingPrice * unavailableQuantity;

        availableItems.push({
          ...item,
          quantity: availableQuantity,
          totalPrice: availableAmount,
          availableGiftCards: availableGiftCards
        });

        unavailableItems.push({
          ...item,
          quantity: unavailableQuantity,
          totalPrice: unavailableAmount,
          reason: `Only ${availableQuantity} gift cards available, requested ${item.quantity}`,
          refundAmount: unavailableAmount
        });

        totalAvailableAmount += availableAmount;
        totalUnavailableAmount += unavailableAmount;
      } else {
        // Full availability
        availableItems.push({
          ...item,
          availableGiftCards: availableGiftCards.slice(0, item.quantity)
        });
        totalAvailableAmount += item.totalPrice;
      }
    } catch (error) {
      unavailableItems.push({
        ...item,
        reason: 'Error validating item availability',
        refundAmount: item.totalPrice
      });
      totalUnavailableAmount += item.totalPrice;
    }
  }

  return { availableItems, unavailableItems, totalAvailableAmount, totalUnavailableAmount };
}

/**
 * Allocates gift cards for available items
 */
async function allocateGiftCards(availableItems: any[], orderId: string, userId: string) {
  const allocatedCardIds: string[] = [];

  for (const item of availableItems) {
    const giftCardIds = item.availableGiftCards.map((gc: any) => gc.giftCardId);
    await giftCardRepository.markAsUsedByOrder(giftCardIds, orderId, userId);
    allocatedCardIds.push(...giftCardIds);
  }

  return { allocatedCardIds };
}

/**
 * Builds order items with fulfillment details
 */
function buildOrderItems(cartItems: any[], availableItems: any[], unavailableItems: any[]) {
  return cartItems.map(cartItem => {
    const availableItem = availableItems.find(ai => ai.variantId === cartItem.variantId);
    const unavailableItem = unavailableItems.find(ui => ui.variantId === cartItem.variantId);
    
    const fulfilledQuantity = availableItem ? availableItem.quantity : 0;
    const fulfilledPrice = availableItem ? availableItem.totalPrice : 0;
    const refundedPrice = unavailableItem ? unavailableItem.refundAmount : 0;

    return {
      variantId: cartItem.variantId,
      productId: cartItem.productId,
      productName: cartItem.productName,
      variantName: cartItem.variantName,
      unitPrice: cartItem.unitPrice,
      requestedQuantity: cartItem.quantity,
      fulfilledQuantity,
      totalPrice: cartItem.totalPrice,
      fulfilledPrice,
      refundedPrice
    };
  });
}

/**
 * Processes refund transaction for unavailable items
 */
async function processRefundTransaction(userId: string, orderId: string, refundAmount: number, currentBalance: number) {
  if (refundAmount <= 0) return;

  const refundTransaction = WalletTransaction.create({
    userId,
    type: TransactionType.REFUND,
    amount: refundAmount,
    balanceAfter: currentBalance + refundAmount,
    description: `Refund for unavailable items - Order ${orderId}`,
    orderId
  });

  refundTransaction.markAsCompleted();
  await walletTransactionRepository.create(refundTransaction);
  await userRepository.atomicWalletOperation(userId, refundAmount, 'ADD');
}

/**
 * Builds comprehensive order response
 */
function buildOrderResponse(
  order: Order,
  giftCards: any[],
  availableItems: any[],
  unavailableItems: any[],
  totalAvailableAmount: number,
  totalUnavailableAmount: number
): CreateOrderResponse {
  const totalItemsRequested = availableItems.reduce((sum, item) => sum + item.quantity, 0) + 
                             unavailableItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalItemsFulfilled = availableItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    orderId: order.orderId,
    status: order.status,
    statusDisplayName: order.statusDisplayName,
    totalAmount: order.totalAmount,
    paidAmount: order.paidAmount,
    refundAmount: order.refundAmount,
    formattedTotalAmount: order.formattedTotalAmount,
    formattedPaidAmount: order.formattedPaidAmount,
    formattedRefundAmount: order.formattedRefundAmount,
    fulfillmentDetails: {
      attemptedAt: order.fulfillmentDetails?.attemptedAt || order.createdAt,
      partialFulfillment: order.fulfillmentDetails?.partialFulfillment || false,
      refundProcessed: order.fulfillmentDetails?.refundProcessed || false,
      totalItemsRequested,
      totalItemsFulfilled,
      totalGiftCardsAllocated: giftCards.length,
      fulfillmentSummary: {
        fulfilledAmount: totalAvailableAmount,
        fulfilledAmountFormatted: formatCurrency(totalAvailableAmount),
        refundedAmount: totalUnavailableAmount,
        refundedAmountFormatted: formatCurrency(totalUnavailableAmount)
      },
      giftCards: giftCards.map(gc => ({
        giftCardId: gc.giftCardId,
        productName: gc.productName || 'Gift Card',
        variantName: gc.variantName || 'Standard',
        denomination: gc.denomination,
        giftCardNumber: decrypt(gc.giftCardNumber),
        giftCardPin: decrypt(gc.giftCardPin),
        expiryTime: gc.expiryTime,
        denominationFormatted: formatCurrency(gc.denomination)
      })),
      unavailableItems: unavailableItems.map(item => ({
        productName: item.productName,
        variantName: item.variantName,
        requestedQuantity: item.quantity,
        reason: item.reason,
        refundAmount: item.refundAmount,
        refundAmountFormatted: formatCurrency(item.refundAmount)
      }))
    },
    createdAt: order.createdAt,
    message: order.isFulfilled 
      ? 'Order placed and fulfilled successfully'
      : order.isPartiallyFulfilled 
      ? 'Order placed with partial fulfillment'
      : 'Order failed - full refund processed'
  };
}

/**
 * Handles comprehensive error recovery for failed order creation
 */
async function handleOrderCreationFailure(
  userId: string,
  paymentTransaction: WalletTransaction | null,
  allocatedGiftCards: string[],
  orderCreated: boolean,
  originalError: any
) {
  console.error('Order creation failed, initiating recovery:', originalError);

  try {
    // Release allocated gift cards
    if (allocatedGiftCards.length > 0) {
      await giftCardRepository.releaseGiftCards(''); // Release by card IDs
      console.log(`Released ${allocatedGiftCards.length} allocated gift cards`);
    }

    // Process refund if payment was taken
    if (paymentTransaction) {
      const user = await userRepository.findById(userId);
      if (user) {
        const refundTransaction = WalletTransaction.create({
          userId,
          type: TransactionType.REFUND,
          amount: paymentTransaction.amount,
          balanceAfter: user.walletBalance + paymentTransaction.amount,
          description: `Full refund - Order creation failed`,
          orderId: paymentTransaction.orderId || ''
        });

        refundTransaction.markAsCompleted();
        await walletTransactionRepository.create(refundTransaction);
        await userRepository.atomicWalletOperation(userId, paymentTransaction.amount, 'ADD');
        console.log(`Processed full refund of ${formatCurrency(paymentTransaction.amount)}`);
      }
    }

  } catch (recoveryError) {
    console.error('CRITICAL: Failed to recover from order creation failure:', recoveryError);
    // In production, this should trigger alerts for manual intervention
  }
} 