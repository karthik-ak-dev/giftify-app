import { OrderResponse, OrderItemResponse, FulfillmentDetailsResponse } from '../../types/order';
import { Order } from '../../models/OrderModel';
import { formatCurrency } from '../../utils/currency';

/**
 * Transform Order model instance to enhanced OrderResponse
 * Shared logic for order services to eliminate code duplication
 */
export const transformOrderToResponse = (order: any): OrderResponse => {
  // Convert items to enhanced format
  const items: OrderItemResponse[] = order.items.map((item: any) => ({
    variantId: item.variantId,
    productId: item.productId,
    productName: item.productName,
    variantName: item.variantName,
    unitPrice: item.unitPrice,
    requestedQuantity: item.requestedQuantity,
    fulfilledQuantity: item.fulfilledQuantity,
    totalPrice: item.totalPrice,
    fulfilledPrice: item.fulfilledPrice,
    refundedPrice: item.refundedPrice,
    formattedUnitPrice: formatCurrency(item.unitPrice),
    formattedTotalPrice: formatCurrency(item.totalPrice),
    formattedFulfilledPrice: formatCurrency(item.fulfilledPrice),
    formattedRefundedPrice: formatCurrency(item.refundedPrice),
    isFullyFulfilled: item.fulfilledQuantity >= item.requestedQuantity,
    isPartiallyFulfilled: item.fulfilledQuantity > 0 && item.fulfilledQuantity < item.requestedQuantity,
    isNotFulfilled: item.fulfilledQuantity === 0,
    fulfillmentPercentage: item.requestedQuantity > 0 
      ? Math.round((item.fulfilledQuantity / item.requestedQuantity) * 100) 
      : 0
  }));

  // Convert fulfillment details if present
  let fulfillmentDetails: FulfillmentDetailsResponse | undefined;
  if (order.fulfillmentDetails) {
    fulfillmentDetails = {
      attemptedAt: order.fulfillmentDetails.attemptedAt,
      fulfilledAt: order.fulfillmentDetails.fulfilledAt,
      partialFulfillment: order.fulfillmentDetails.partialFulfillment,
      refundProcessed: order.fulfillmentDetails.refundProcessed,
      formattedAttemptedAt: order.fulfillmentDetails.attemptedAt 
        ? new Date(order.fulfillmentDetails.attemptedAt).toLocaleString('en-IN')
        : undefined,
      formattedFulfilledAt: order.fulfillmentDetails.fulfilledAt 
        ? new Date(order.fulfillmentDetails.fulfilledAt).toLocaleString('en-IN')
        : undefined
    };
  }

  // Calculate days since created
  const daysSinceCreated = Math.floor(
    (new Date().getTime() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    orderId: order.orderId,
    userId: order.userId,
    status: order.status,
    statusDisplayName: order.statusDisplayName || Order.getStatusDisplayName(order.status),
    totalAmount: order.totalAmount,
    paidAmount: order.paidAmount,
    refundAmount: order.refundAmount,
    formattedTotalAmount: order.formattedTotalAmount || formatCurrency(order.totalAmount),
    formattedPaidAmount: order.formattedPaidAmount || formatCurrency(order.paidAmount),
    formattedRefundAmount: order.formattedRefundAmount || formatCurrency(order.refundAmount),
    items,
    fulfillmentDetails,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    formattedCreatedAt: new Date(order.createdAt).toLocaleString('en-IN'),
    formattedUpdatedAt: new Date(order.updatedAt).toLocaleString('en-IN'),
    canBeCancelled: !order.isFulfilled && !order.isCancelled && !order.isFailed,
    canBeRefunded: order.hasRefund || false,
    isCompleted: order.isCompleted || false,
    isPending: order.isPending || false,
    isCancelled: order.isCancelled || false,
    isFailed: order.isFailed || false,
    totalItems: order.totalItemCount || items.reduce((sum: number, item: any) => sum + item.requestedQuantity, 0),
    totalFulfilledItems: order.fulfilledItemCount || items.reduce((sum: number, item: any) => sum + item.fulfilledQuantity, 0),
    totalRefundedAmount: items.reduce((sum: number, item: any) => sum + item.refundedPrice, 0),
    daysSinceCreated
  };
};

/**
 * Common validation logic for order services
 */
export const validateOrderAccess = async (orderId: string, userId: string, userRepository: any, orderRepository: any) => {
  // Validate input parameters
  if (!orderId || !userId) {
    throw new Error('Order ID and User ID are required');
  }

  // Validate user exists and is active
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.isActive) {
    throw new Error('User account is inactive');
  }

  // Find order by ID
  const order = await orderRepository.findById(orderId);
  
  if (!order) {
    throw new Error('Order not found');
  }

  // Verify order ownership
  if (order.userId !== userId) {
    throw new Error('Access denied - Order does not belong to user');
  }

  return { user, order };
};

/**
 * Common validation logic for user access in order services
 */
export const validateUserAccess = async (userId: string, userRepository: any) => {
  // Validate input parameters
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Validate user exists and is active
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.isActive) {
    throw new Error('User account is inactive');
  }

  return user;
}; 