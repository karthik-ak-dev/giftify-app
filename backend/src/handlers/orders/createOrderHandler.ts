import { Response, NextFunction } from 'express';
import { createOrderService } from '../../services/orders/createOrderService';
import { ApiResponse } from '../../types/api';
import { AuthenticatedRequest } from '../../types/auth';

export const createOrderHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const orderResult = await createOrderService(userId);

    // Determine response message based on fulfillment status
    let message = 'Order created successfully';
    let statusCode = 201;

    if (orderResult.status === 'FAILED') {
      message = 'Order could not be fulfilled due to stock unavailability. Full refund processed.';
      statusCode = 200;
    } else if (orderResult.status === 'PARTIALLY_FULFILLED') {
      message = `Order partially fulfilled. ${orderResult.fulfillmentDetails.totalGiftCardsAllocated} gift cards allocated. Refund processed for unavailable items.`;
      statusCode = 200;
    } else if (orderResult.status === 'FULFILLED') {
      message = `Order fulfilled successfully. ${orderResult.fulfillmentDetails.totalGiftCardsAllocated} gift cards allocated.`;
      statusCode = 201;
    }

    const response: ApiResponse = {
      success: true,
      data: {
        order: {
          orderId: orderResult.orderId,
          status: orderResult.status,
          statusDisplayName: orderResult.statusDisplayName,
          totalAmount: orderResult.totalAmount,
          paidAmount: orderResult.paidAmount,
          refundAmount: orderResult.refundAmount,
          formattedTotalAmount: orderResult.formattedTotalAmount,
          formattedPaidAmount: orderResult.formattedPaidAmount,
          formattedRefundAmount: orderResult.formattedRefundAmount,
          createdAt: orderResult.createdAt
        },
        fulfillment: {
          attemptedAt: orderResult.fulfillmentDetails.attemptedAt,
          partialFulfillment: orderResult.fulfillmentDetails.partialFulfillment,
          refundProcessed: orderResult.fulfillmentDetails.refundProcessed,
          summary: orderResult.fulfillmentDetails.fulfillmentSummary,
          giftCards: orderResult.fulfillmentDetails.giftCards,
          unavailableItems: orderResult.fulfillmentDetails.unavailableItems,
          statistics: {
            totalItemsRequested: orderResult.fulfillmentDetails.totalItemsRequested,
            totalItemsFulfilled: orderResult.fulfillmentDetails.totalItemsFulfilled,
            totalGiftCardsAllocated: orderResult.fulfillmentDetails.totalGiftCardsAllocated
          }
        }
      },
      message,
      timestamp: new Date().toISOString()
    };

    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
}; 