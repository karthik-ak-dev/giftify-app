import { GiftCardModel } from '../models/GiftCardModel';
import { GiftCard } from '../types/giftCard';
import { PaginationParams, PaginatedResponse } from '../types/api';
import { db } from '../utils/database';

export class GiftCardRepository {
  async findByOrderId(orderId: string): Promise<GiftCard[]> {
    const items = await db.scan(GiftCardModel.tableName, {
      FilterExpression: 'usedByOrder = :orderId',
      ExpressionAttributeValues: {
        ':orderId': orderId
      }
    });
    return items.map(item => GiftCardModel.toGiftCard(item));
  }

  /**
   * Find available (unused and not expired) gift cards for a specific variant
   */
  async findAvailableByVariant(variantId: string, quantity: number): Promise<GiftCard[]> {
    const now = new Date().toISOString();
    
    const items = await db.scan(GiftCardModel.tableName, {
      FilterExpression: 'variantId = :variantId AND attribute_not_exists(usedByOrder) AND expiryTime > :now',
      ExpressionAttributeValues: {
        ':variantId': variantId,
        ':now': now
      },
      Limit: quantity
    });
    
    return items.map(item => GiftCardModel.toGiftCard(item));
  }

  /**
   * Mark gift cards as used by an order
   */
  async markAsUsedByOrder(giftCardIds: string[], orderId: string, userId: string): Promise<void> {
    const now = new Date().toISOString();
    
    for (const giftCardId of giftCardIds) {
      await db.update(GiftCardModel.tableName, { giftCardId }, {
        usedByOrder: orderId,
        usedByUser: userId,
        usedAt: now,
        updatedAt: now
      });
    }
  }

  /**
   * Release gift cards back to available (remove usage info)
   */
  async releaseGiftCards(orderId: string): Promise<void> {
    // Find gift cards used by this order
    const usedCards = await this.findByOrderId(orderId);
    
    const now = new Date().toISOString();

    for (const card of usedCards) {
      await db.update(GiftCardModel.tableName, { giftCardId: card.giftCardId }, {
        usedByOrder: null,
        usedByUser: null,
        usedAt: null,
        updatedAt: now
      });
    }
  }
}

export const giftCardRepository = new GiftCardRepository(); 