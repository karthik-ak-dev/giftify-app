import { GiftCardModel } from '../models/GiftCardModel';
import { GiftCard } from '../types/giftCard';
import { PaginationParams, PaginatedResponse } from '../types/api';
import { db } from '../utils/database';

export class GiftCardRepository {
  async create(giftCardData: any): Promise<GiftCard> {
    const item = await db.put(GiftCardModel.tableName, giftCardData);
    return GiftCardModel.toGiftCard(item);
  }

  async findById(giftCardId: string): Promise<GiftCard | null> {
    const item = await db.get(GiftCardModel.tableName, { giftCardId });
    return item ? GiftCardModel.toGiftCard(item) : null;
  }

  async findByUserId(
    userId: string,
    options: PaginationParams & { status?: string }
  ): Promise<PaginatedResponse<GiftCard>> {
    const { page = 1, limit = 20, status } = options;
    
    let items = await db.queryGSI(
      GiftCardModel.tableName,
      GiftCardModel.userGiftCardsGSI,
      GiftCardModel.userGiftCardsGSIPartitionKey,
      userId
    );

    // Filter by status if provided
    if (status) {
      items = items.filter(item => item.status === status);
    }

    // Sort by issuedAt descending
    items.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    const totalPages = Math.ceil(items.length / limit);
    
    return {
      items: paginatedItems.map(item => GiftCardModel.toGiftCard(item)),
      pagination: {
        page,
        limit,
        total: items.length,
        totalPages,
        hasNext: endIndex < items.length,
        hasPrev: page > 1
      }
    };
  }

  async findByOrderId(orderId: string): Promise<GiftCard[]> {
    const items = await db.queryGSI(
      GiftCardModel.tableName,
      GiftCardModel.orderGiftCardsGSI,
      GiftCardModel.orderGiftCardsGSIPartitionKey,
      orderId
    );
    return items.map(item => GiftCardModel.toGiftCard(item));
  }

  async findByGiftCardNumber(giftCardNumber: string): Promise<GiftCard | null> {
    const items = await db.queryGSI(
      GiftCardModel.tableName,
      GiftCardModel.giftCardNumberGSI,
      GiftCardModel.giftCardNumberGSIKey,
      giftCardNumber
    );
    return items.length > 0 ? GiftCardModel.toGiftCard(items[0]) : null;
  }

  async updateStatus(giftCardId: string, status: string, redeemedAt?: string): Promise<void> {
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (redeemedAt) {
      updateData.redeemedAt = redeemedAt;
    }

    await db.update(GiftCardModel.tableName, { giftCardId }, updateData);
  }

  async update(giftCardId: string, updateData: any): Promise<GiftCard> {
    const updatedItem = await db.update(GiftCardModel.tableName, { giftCardId }, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    return GiftCardModel.toGiftCard(updatedItem);
  }

  async delete(giftCardId: string): Promise<void> {
    await db.delete(GiftCardModel.tableName, { giftCardId });
  }

  async findActiveByUserId(userId: string): Promise<GiftCard[]> {
    const result = await this.findByUserId(userId, { status: 'ACTIVE' });
    return result.items;
  }

  async findExpiredCards(): Promise<GiftCard[]> {
    const today = new Date().toISOString().split('T')[0];
    
    // This would require a more complex query or scan
    // For now, we'll scan the table (not ideal for production)
    const items = await db.scan(GiftCardModel.tableName, {
      FilterExpression: 'expiryDate < :today AND #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':today': today,
        ':status': 'ACTIVE'
      }
    });
    
    return items.map(item => GiftCardModel.toGiftCard(item));
  }

  async markAsExpired(giftCardId: string): Promise<void> {
    await this.updateStatus(giftCardId, 'EXPIRED');
  }

  async redeemCard(giftCardId: string): Promise<void> {
    await this.updateStatus(giftCardId, 'REDEEMED', new Date().toISOString());
  }
}

export const giftCardRepository = new GiftCardRepository(); 