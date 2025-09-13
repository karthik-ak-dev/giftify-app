import { GiftCard, GIFT_CARD_TABLE } from '../models/GiftCardModel';
import { db } from '../utils/database';

export class GiftCardRepository {
  async create(giftCard: GiftCard): Promise<GiftCard> {
    await db.put(GIFT_CARD_TABLE, giftCard);
    return giftCard;
  }

  async findById(giftCardId: string): Promise<GiftCard | null> {
    const item = await db.get(GIFT_CARD_TABLE, { giftCardId });
    return item ? new GiftCard(item as any) : null;
  }

  async findByOrderId(orderId: string): Promise<GiftCard[]> {
    const items = await db.scan(GIFT_CARD_TABLE, {
      FilterExpression: 'usedByOrder = :orderId',
      ExpressionAttributeValues: {
        ':orderId': orderId
      }
    });
    return items.map(item => new GiftCard(item as any));
  }

  async findByUserId(userId: string): Promise<GiftCard[]> {
    const items = await db.scan(GIFT_CARD_TABLE, {
      FilterExpression: 'usedByUser = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    });
    return items.map(item => new GiftCard(item as any));
  }

  /**
   * Find available (unused and not expired) gift cards for a specific variant
   * Returns cards sorted by expiry time (expiring first) for FIFO allocation
   */
  async findAvailableByVariant(variantId: string, quantity: number): Promise<GiftCard[]> {
    const now = new Date().toISOString();
    
    const items = await db.scan(GIFT_CARD_TABLE, {
      FilterExpression: 'variantId = :variantId AND attribute_not_exists(usedByOrder) AND expiryTime > :now',
      ExpressionAttributeValues: {
        ':variantId': variantId,
        ':now': now
      },
      Limit: quantity
    });
    
    // Convert to GiftCard instances and sort by expiry time
    const giftCards = items.map(item => new GiftCard(item as any));
    giftCards.sort((a, b) => a.expiryTime.localeCompare(b.expiryTime));
    
    return giftCards.slice(0, quantity);
  }

  /**
   * Mark gift cards as used by an order
   */
  async markAsUsedByOrder(giftCards: GiftCard[], orderId: string, userId: string): Promise<GiftCard[]> {
    const updatedCards: GiftCard[] = [];
    
    for (const giftCard of giftCards) {
      giftCard.markAsUsed(orderId, userId);
      await db.update(GIFT_CARD_TABLE, { giftCardId: giftCard.giftCardId }, {
        usedByOrder: giftCard.usedByOrder,
        usedByUser: giftCard.usedByUser,
        usedAt: giftCard.usedAt,
        updatedAt: giftCard.updatedAt
      });
      updatedCards.push(giftCard);
    }
    
    return updatedCards;
  }

  /**
   * Release gift cards back to available pool
   */
  async releaseGiftCards(orderId: string): Promise<GiftCard[]> {
    const usedCards = await this.findByOrderId(orderId);
    const releasedCards: GiftCard[] = [];
    
    for (const giftCard of usedCards) {
      giftCard.release();
      await db.update(GIFT_CARD_TABLE, { giftCardId: giftCard.giftCardId }, {
        usedByOrder: null,
        usedByUser: null,
        usedAt: null,
        updatedAt: giftCard.updatedAt
      });
      releasedCards.push(giftCard);
    }
    
    return releasedCards;
  }

  async save(giftCard: GiftCard): Promise<GiftCard> {
    await db.put(GIFT_CARD_TABLE, giftCard);
    return giftCard;
  }

  // Business query methods
  async findExpiredCards(): Promise<GiftCard[]> {
    const now = new Date().toISOString();
    const items = await db.scan(GIFT_CARD_TABLE, {
      FilterExpression: 'expiryTime <= :now',
      ExpressionAttributeValues: {
        ':now': now
      }
    });
    return items.map(item => new GiftCard(item as any));
  }

  async findExpiringSoonByVariant(variantId: string, daysFromNow: number = 30): Promise<GiftCard[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
    const futureISOString = futureDate.toISOString();
    const nowISOString = now.toISOString();
    
    const items = await db.scan(GIFT_CARD_TABLE, {
      FilterExpression: 'variantId = :variantId AND attribute_not_exists(usedByOrder) AND expiryTime > :now AND expiryTime <= :future',
      ExpressionAttributeValues: {
        ':variantId': variantId,
        ':now': nowISOString,
        ':future': futureISOString
      }
    });
    
    const giftCards = items.map(item => new GiftCard(item as any));
    giftCards.sort((a, b) => a.expiryTime.localeCompare(b.expiryTime));
    
    return giftCards;
  }

  async getVariantAvailabilityStats(variantId: string): Promise<{
    total: number;
    available: number;
    used: number;
    expired: number;
  }> {
    const items = await db.scan(GIFT_CARD_TABLE, {
      FilterExpression: 'variantId = :variantId',
      ExpressionAttributeValues: {
        ':variantId': variantId
      }
    });
    
    const giftCards = items.map(item => new GiftCard(item as any));
    
    const stats = {
      total: giftCards.length,
      available: 0,
      used: 0,
      expired: 0
    };
    
    giftCards.forEach(card => {
      if (card.isExpired) {
        stats.expired++;
      } else if (card.isUsed) {
        stats.used++;
      } else {
        stats.available++;
      }
    });
    
    return stats;
  }

  async findByProductId(productId: string): Promise<GiftCard[]> {
    const items = await db.scan(GIFT_CARD_TABLE, {
      FilterExpression: 'productId = :productId',
      ExpressionAttributeValues: {
        ':productId': productId
      }
    });
    return items.map(item => new GiftCard(item as any));
  }

  async delete(giftCard: GiftCard): Promise<void> {
    await db.delete(GIFT_CARD_TABLE, { giftCardId: giftCard.giftCardId });
  }
}

export const giftCardRepository = new GiftCardRepository(); 