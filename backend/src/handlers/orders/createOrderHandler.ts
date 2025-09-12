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
    const { items } = req.body;
    
    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const orderResult = await createOrderService(userId, items);

    // Determine response message based on fulfillment status
    let message = 'Order created successfully';
    let statusCode = 201;

    if (orderResult.status === 'FAILED') {
      message = 'Order could not be fulfilled due to stock unavailability. Full refund processed.';
      statusCode = 200;
    } else if (orderResult.status === 'PARTIALLY_FULFILLED') {
      message = `Order partially fulfilled. ${orderResult.fulfillmentDetails.totalGiftCardsGenerated} gift cards generated. Refund processed for unavailable items.`;
      statusCode = 200;
    } else if (orderResult.status === 'FULFILLED') {
      message = `Order fulfilled successfully. ${orderResult.fulfillmentDetails.totalGiftCardsGenerated} gift cards generated.`;
      statusCode = 201;
    }

    const response: ApiResponse = {
      success: true,
      data: {
        order: {
          orderId: orderResult.orderId,
          status: orderResult.status,
          totalAmount: orderResult.totalAmount,
          paidAmount: orderResult.paidAmount,
          refundAmount: orderResult.refundAmount,
          items: orderResult.items,
          createdAt: orderResult.createdAt,
          updatedAt: orderResult.updatedAt
        },
        fulfillment: {
          summary: orderResult.fulfillmentDetails.fulfillmentSummary,
          giftCards: orderResult.fulfillmentDetails.giftCards,
          unavailableItems: orderResult.fulfillmentDetails.unavailableItems,
          statistics: {
            totalItemsRequested: orderResult.fulfillmentDetails.totalItemsRequested,
            totalItemsFulfilled: orderResult.fulfillmentDetails.totalItemsFulfilled,
            totalGiftCardsGenerated: orderResult.fulfillmentDetails.totalGiftCardsGenerated,
            partialFulfillment: orderResult.fulfillmentDetails.partialFulfillment,
            refundProcessed: orderResult.fulfillmentDetails.refundProcessed
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