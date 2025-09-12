import { orderRepository } from '../../repositories/orderRepository';
import { cartRepository } from '../../repositories/cartRepository';
import { userRepository } from '../../repositories/userRepository';
import { walletTransactionRepository } from '../../repositories/walletTransactionRepository';
import { productVariantRepository } from '../../repositories/productVariantRepository';
import { giftCardRepository } from '../../repositories/giftCardRepository';
import { CreateOrderRequest, Order } from '../../types/order';
import { AppError } from '../../middleware/errorHandler';
import { formatCurrency } from '../../utils/currency';
import { generateGiftCardNumber, generateGiftCardPin, encrypt } from '../../utils/crypto';
import { GiftCardModel } from '../../models/GiftCardModel';
import { APP_CONSTANTS } from '../../config/constants';
import { ulid } from 'ulid';

interface FulfillmentResult {
  fulfilledItems: any[];
  unfulfilledItems: any[];
  totalFulfilled: number;
  totalUnfulfilled: number;
  giftCards: any[];
}

/**
 * Validates stock availability for cart items
 */
const validateStockAvailability = async (cartItems: any[]): Promise<{ availableItems: any[], unavailableItems: any[] }> => {
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

    if (variant.stockQuantity < item.quantity) {
      // Partial availability
      if (variant.stockQuantity > 0) {
        availableItems.push({
          ...item,
          quantity: variant.stockQuantity,
          totalPrice: variant.sellingPrice * variant.stockQuantity,
          originalQuantity: item.quantity
        });
        unavailableItems.push({
          ...item,
          quantity: item.quantity - variant.stockQuantity,
          totalPrice: variant.sellingPrice * (item.quantity - variant.stockQuantity),
          reason: `Only ${variant.stockQuantity} available, requested ${item.quantity}`
        });
      } else {
        unavailableItems.push({
          ...item,
          reason: 'Out of stock'
        });
      }
    } else {
      // Fully available
      availableItems.push(item);
    }
  }

  return { availableItems, unavailableItems };
};

/**
 * Generates gift cards for fulfilled items
 */
const generateGiftCards = async (orderId: string, userId: string, fulfilledItems: any[]): Promise<any[]> => {
  const giftCards: any[] = [];
  const now = new Date().toISOString();

  for (const item of fulfilledItems) {
    for (let i = 0; i < item.quantity; i++) {
      const giftCardId = ulid();
      const giftCardNumber = generateGiftCardNumber();
      const giftCardPin = generateGiftCardPin();
      
      // Get variant details for denomination
      const variant = await productVariantRepository.findById(item.variantId);
      if (!variant) continue;

      const giftCardData = {
        giftCardId,
        orderId,
        userId,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        variantName: item.variantName,
        denomination: variant.denomination,
        giftCardNumber: encrypt(giftCardNumber),
        giftCardPin: encrypt(giftCardPin),
        expiryDate: GiftCardModel.generateExpiryDate(),
        status: APP_CONSTANTS.GIFT_CARD_STATUS.ACTIVE,
        purchasePrice: variant.sellingPrice,
        issuedAt: now,
        createdAt: now,
        updatedAt: now
      };

      const giftCard = await giftCardRepository.create(giftCardData);
      giftCards.push({
        ...giftCard,
        giftCardNumber, // Return unencrypted for response
        giftCardPin     // Return unencrypted for response
      });
    }
  }

  return giftCards;
};

/**
 * Updates stock quantities for fulfilled items
 */
const updateStockQuantities = async (fulfilledItems: any[]): Promise<void> => {
  for (const item of fulfilledItems) {
    const variant = await productVariantRepository.findById(item.variantId);
    if (variant) {
      const newStock = variant.stockQuantity - item.quantity;
      await productVariantRepository.updateStock(item.variantId, newStock);
    }
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
    description: `Refund for unfulfilled items - Order ${orderId}`,
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
    totalGiftCardsGenerated: number;
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
      expiryDate: string;
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

    // Step 2: Validate stock availability
    const { availableItems, unavailableItems } = await validateStockAvailability(cart.items);
    
    // Step 3: Calculate fulfillment amounts
    const totalFulfilled = availableItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalUnfulfilled = unavailableItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Step 4: Generate gift cards for fulfilled items
    const giftCards = await generateGiftCards(orderId, userId, availableItems);
    
    // Step 5: Update stock quantities
    await updateStockQuantities(availableItems);
    
    // Step 6: Process refund for unfulfilled items
    if (totalUnfulfilled > 0) {
      await processRefund(userId, orderId, totalUnfulfilled);
    }
    
    // Step 7: Determine order status
    let orderStatus: string;
    if (availableItems.length === 0) {
      orderStatus = APP_CONSTANTS.ORDER_STATUS.FAILED;
    } else if (unavailableItems.length === 0) {
      orderStatus = APP_CONSTANTS.ORDER_STATUS.FULFILLED;
    } else {
      orderStatus = APP_CONSTANTS.ORDER_STATUS.PARTIALLY_FULFILLED;
    }

    // Step 8: Create order record
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
        totalItemsRequested: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        totalItemsFulfilled: availableItems.reduce((sum, item) => sum + item.quantity, 0),
        totalGiftCardsGenerated: giftCards.length,
        fulfillmentSummary: {
          fulfilledAmount: totalFulfilled,
          fulfilledAmountFormatted: formatCurrency(totalFulfilled),
          refundedAmount: totalUnfulfilled,
          refundedAmountFormatted: formatCurrency(totalUnfulfilled),
          totalPaidAmount: totalAmount,
          totalPaidAmountFormatted: formatCurrency(totalAmount)
        }
      },
      createdAt: now,
      updatedAt: now
    };

    const order = await orderRepository.create(orderData);

    // Step 9: Clear cart
    await cartRepository.delete(userId);

         // Step 10: Return comprehensive order details
     return {
       ...order,
       fulfillmentDetails: {
         attemptedAt: now,
         partialFulfillment: unavailableItems.length > 0,
         refundProcessed: totalUnfulfilled > 0,
         totalItemsRequested: cart.items.reduce((sum, item) => sum + item.quantity, 0),
         totalItemsFulfilled: availableItems.reduce((sum, item) => sum + item.quantity, 0),
         totalGiftCardsGenerated: giftCards.length,
         fulfillmentSummary: {
           fulfilledAmount: totalFulfilled,
           fulfilledAmountFormatted: formatCurrency(totalFulfilled),
           refundedAmount: totalUnfulfilled,
           refundedAmountFormatted: formatCurrency(totalUnfulfilled),
           totalPaidAmount: totalAmount,
           totalPaidAmountFormatted: formatCurrency(totalAmount)
         },
         giftCards: giftCards.map(gc => ({
           giftCardId: gc.giftCardId,
           productName: gc.productName,
           variantName: gc.variantName,
           denomination: gc.denomination,
           giftCardNumber: gc.giftCardNumber,
           giftCardPin: gc.giftCardPin,
           expiryDate: gc.expiryDate,
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
    // If anything fails after payment, attempt to refund the full amount
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
    } catch (refundError) {
      console.error('Critical: Failed to refund after order creation failure:', refundError);
      // In production, this should trigger an alert for manual intervention
    }
    
    throw error instanceof AppError ? error : new AppError('Order creation failed', 500, 'ORDER_CREATION_FAILED');
  }
}; 