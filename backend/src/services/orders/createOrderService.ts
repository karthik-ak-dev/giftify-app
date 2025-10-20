import { orderRepository } from '../../repositories/orderRepository';
import { cartRepository } from '../../repositories/cartRepository';
import { userRepository } from '../../repositories/userRepository';
import { walletTransactionRepository } from '../../repositories/walletTransactionRepository';
import { brandRepository } from '../../repositories/brandRepository';
import { giftCardRepository } from '../../repositories/giftCardRepository';
import { Order } from '../../models/OrderModel';
import { WalletTransaction, TransactionType } from '../../models/WalletTransactionModel';
import { CreateOrderResponse } from '../../types/order';
import { AppError } from '../../middleware/errorHandler';
import { formatCurrency } from '../../utils/currency';

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
  let tempOrderId: string | null = null;

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

    // Step 2: Validate cart items and atomically reserve gift cards
    tempOrderId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const validationResults = await validateCartAndReserveGiftCards(cart.items, tempOrderId, userId);
    const { availableItems, unavailableItems, totalAvailableAmount, totalUnavailableAmount, reservedCardsByVariant } = validationResults;

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

    // First transition to PROCESSING state
    order.markAsProcessing();

    // Then update order status based on fulfillment
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

    // Step 7: Update reservations to use the real order ID and confirm them
    await updateReservationsToOrder(tempOrderId, savedOrder.orderId);
    const confirmedCards = await giftCardRepository.confirmReservations(savedOrder.orderId);
    allocatedGiftCards = confirmedCards.map(card => card.giftCardId);

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
    await handleOrderCreationFailure(userId, paymentTransaction, tempOrderId, orderCreated, error);
    
    // Re-throw the original error or a wrapped error
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError('Order creation failed', 500, 'ORDER_CREATION_FAILED');
  }
};

/**
 * Validates cart items and atomically reserves gift cards
 * This prevents concurrent orders from getting the same vouchers
 */
async function validateCartAndReserveGiftCards(cartItems: any[], orderId: string, userId: string) {
  const availableItems: any[] = [];
  const unavailableItems: any[] = [];
  let totalAvailableAmount = 0;
  let totalUnavailableAmount = 0;
  const reservedCardsByVariant: { [variantId: string]: any[] } = {};

  for (const item of cartItems) {
    try {
      // Validate brand variant
      const result = await brandRepository.findByVariantId(item.variantId);
      if (!result) {
        unavailableItems.push({
          ...item,
          reason: 'Brand variant not found',
          refundAmount: item.totalPrice
        });
        totalUnavailableAmount += item.totalPrice;
        continue;
      }

      const { brand, variant } = result;

      if (!brand.isActive || variant.isActive === false) {
        unavailableItems.push({
          ...item,
          reason: 'Brand variant is inactive',
          refundAmount: item.totalPrice
        });
        totalUnavailableAmount += item.totalPrice;
        continue;
      }

      // Atomically reserve gift cards for this item
      // The repository will return whatever cards it can reserve (0 to requested quantity)
      const reservedCards = await giftCardRepository.reserveGiftCards(
        item.variantId, 
        item.quantity, 
        orderId, 
        userId, 
        5 // 5 minute reservation
      );
      
      if (reservedCards.length === 0) {
        // No cards could be reserved
        unavailableItems.push({
          ...item,
          reason: 'No gift cards available due to high demand',
          refundAmount: item.totalPrice
        });
        totalUnavailableAmount += item.totalPrice;
      } else if (reservedCards.length < item.quantity) {
        // Partial reservation - split the item
        const availableQuantity = reservedCards.length;
        const unavailableQuantity = item.quantity - availableQuantity;
        // Unit price is already in paise from cart
        const availableAmount = item.unitPrice * availableQuantity;
        const unavailableAmount = item.unitPrice * unavailableQuantity;

        // Add available portion
        availableItems.push({
          ...item,
          quantity: availableQuantity,
          totalPrice: availableAmount,
          reservedGiftCards: reservedCards
        });

        // Add unavailable portion
        unavailableItems.push({
          ...item,
          quantity: unavailableQuantity,
          totalPrice: unavailableAmount,
          reason: `Only ${availableQuantity} gift cards available, requested ${item.quantity}`,
          refundAmount: unavailableAmount
        });

        totalAvailableAmount += availableAmount;
        totalUnavailableAmount += unavailableAmount;
        reservedCardsByVariant[item.variantId] = reservedCards;
      } else {
        // Full reservation successful
        availableItems.push({
          ...item,
          reservedGiftCards: reservedCards
        });
        totalAvailableAmount += item.totalPrice;
        reservedCardsByVariant[item.variantId] = reservedCards;
      }
    } catch (error: any) {
      // If there's any error during validation/reservation, mark item as unavailable
      unavailableItems.push({
        ...item,
        reason: `Error processing item: ${error.message || 'Unknown error'}`,
        refundAmount: item.totalPrice
      });
      totalUnavailableAmount += item.totalPrice;
    }
  }

  return { 
    availableItems, 
    unavailableItems, 
    totalAvailableAmount, 
    totalUnavailableAmount,
    reservedCardsByVariant 
  };
}

/**
 * Updates reservations from temporary order ID to real order ID
 */
async function updateReservationsToOrder(tempOrderId: string, realOrderId: string) {
  const reservedCards = await giftCardRepository.findReservedByOrder(tempOrderId);
  
  for (const card of reservedCards) {
    card.reservedByOrder = realOrderId;
    await giftCardRepository.save(card);
  }
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
      brandId: cartItem.brandId,
      brandName: cartItem.brandName,
      variantId: cartItem.variantId,
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
        brandName: gc.brandName || 'Gift Card',
        variantName: gc.variantName || 'Standard',
        denomination: gc.denomination,
        giftCardNumber: gc.giftCardNumber,
        giftCardPin: gc.giftCardPin,
        expiryTime: gc.expiryTime,
        denominationFormatted: formatCurrency(gc.denomination)
      })),
      unavailableItems: unavailableItems.map(item => ({
        brandName: item.brandName,
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
  tempOrderId: string | null,
  orderCreated: boolean,
  originalError: any
) {
  console.error('Order creation failed, initiating recovery:', originalError);

  try {
    // Release reserved gift cards
    if (tempOrderId) {
      const releasedCards = await giftCardRepository.releaseReservations(tempOrderId);
      console.log(`Released ${releasedCards.length} reserved gift cards`);
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