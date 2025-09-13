import { PutCommand, GetCommand, DeleteCommand, ScanCommand, UpdateCommand, QueryCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { GiftCard, GIFT_CARD_TABLE, VARIANT_EXPIRY_GSI, ORDER_CARDS_GSI, USER_CARDS_GSI } from '../models/GiftCardModel';
import { docClient } from '../utils/database';

export class GiftCardRepository {
  async create(giftCard: GiftCard): Promise<GiftCard> {
    const command = new PutCommand({
      TableName: GIFT_CARD_TABLE,
      Item: giftCard,
      ConditionExpression: 'attribute_not_exists(giftCardId)' // Prevent overwriting existing gift card
    });
    
    try {
      await docClient.send(command);
      return giftCard;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Gift card already exists');
      }
      throw error;
    }
  }

  async findById(giftCardId: string): Promise<GiftCard | null> {
    const command = new GetCommand({
      TableName: GIFT_CARD_TABLE,
      Key: { giftCardId }
    });
    
    const result = await docClient.send(command);
    return result.Item ? new GiftCard(result.Item as any) : null;
  }

  /**
   * Find gift cards by order ID using GSI (no scan)
   */
  async findByOrderId(orderId: string): Promise<GiftCard[]> {
    const command = new QueryCommand({
      TableName: GIFT_CARD_TABLE,
      IndexName: ORDER_CARDS_GSI,
      KeyConditionExpression: 'usedByOrder = :orderId',
      ExpressionAttributeValues: {
        ':orderId': orderId
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new GiftCard(item as any));
  }

  /**
   * Find gift cards by user ID using GSI (no scan)
   */
  async findByUserId(userId: string): Promise<GiftCard[]> {
    const command = new QueryCommand({
      TableName: GIFT_CARD_TABLE,
      IndexName: USER_CARDS_GSI,
      KeyConditionExpression: 'usedByUser = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false // Most recent first
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new GiftCard(item as any));
  }

  /**
   * Find available gift cards for a specific variant using GSI (no scan)
   * Uses variantId + expiryTime GSI for efficient FIFO allocation
   */
  async findAvailableByVariant(variantId: string, quantity: number): Promise<GiftCard[]> {
    const now = new Date().toISOString();
    
    const command = new QueryCommand({
      TableName: GIFT_CARD_TABLE,
      IndexName: VARIANT_EXPIRY_GSI,
      KeyConditionExpression: 'variantId = :variantId AND expiryTime > :now',
      FilterExpression: 'attribute_not_exists(usedByOrder) AND (attribute_not_exists(reservedByOrder) OR reservationExpiresAt < :now)', // Only unused and unreserved cards
      ExpressionAttributeValues: {
        ':variantId': variantId,
        ':now': now
      },
      Limit: quantity,
      ScanIndexForward: true // Sort by expiryTime ascending (FIFO - expiring first)
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new GiftCard(item as any));
  }

  /**
   * Atomically reserve gift cards for an order (prevents concurrent allocation)
   * This is the key method for preventing duplicate voucher allocation
   * Returns whatever cards could be reserved (may be less than requested quantity)
   */
  async reserveGiftCards(variantId: string, quantity: number, orderId: string, userId: string, reservationMinutes: number = 10): Promise<GiftCard[]> {
    const reservedCards: GiftCard[] = [];
    const now = new Date().toISOString();
    
    // Find available cards with a buffer to handle concurrent requests
    const availableCards = await this.findAvailableByVariant(variantId, Math.max(quantity * 2, 50)); // Get more than needed
    
    if (availableCards.length === 0) {
      // No cards available at all
      return [];
    }

    // Try to reserve cards one by one atomically
    // Reserve as many as possible, up to the requested quantity
    for (const card of availableCards) {
      if (reservedCards.length >= quantity) {
        break; // We have enough cards
      }

      try {
        // Attempt atomic reservation
        card.reserve(orderId, userId, reservationMinutes);
        
        const command = new UpdateCommand({
          TableName: GIFT_CARD_TABLE,
          Key: { giftCardId: card.giftCardId },
          UpdateExpression: 'SET reservedByOrder = :orderId, reservedByUser = :userId, reservedAt = :reservedAt, reservationExpiresAt = :expiresAt, updatedAt = :updatedAt',
          ExpressionAttributeValues: {
            ':orderId': card.reservedByOrder,
            ':userId': card.reservedByUser,
            ':reservedAt': card.reservedAt,
            ':expiresAt': card.reservationExpiresAt,
            ':updatedAt': card.updatedAt,
            ':now': now
          },
          // Critical: Only reserve if card is truly available
          ConditionExpression: 'attribute_not_exists(usedByOrder) AND (attribute_not_exists(reservedByOrder) OR reservationExpiresAt < :now) AND expiryTime > :now'
        });
        
        await docClient.send(command);
        reservedCards.push(card);
        
      } catch (error: any) {
        if (error.name === 'ConditionalCheckFailedException') {
          // Card was taken by another request, continue to next card
          console.log(`Gift card ${card.giftCardId} was already reserved/used by another request`);
          continue;
        }
        // For other errors, log but continue trying other cards
        console.warn(`Failed to reserve gift card ${card.giftCardId}:`, error.message);
        continue;
      }
    }

    // Return whatever we managed to reserve (could be 0 to quantity)
    console.log(`Reserved ${reservedCards.length} out of ${quantity} requested gift cards for variant ${variantId}`);
    return reservedCards;
  }

  /**
   * Confirm reservations and mark cards as used
   */
  async confirmReservations(orderId: string): Promise<GiftCard[]> {
    // Find all cards reserved by this order
    const reservedCards = await this.findReservedByOrder(orderId);
    const confirmedCards: GiftCard[] = [];

    for (const card of reservedCards) {
      try {
        card.confirmReservation();
        
        const command = new UpdateCommand({
          TableName: GIFT_CARD_TABLE,
          Key: { giftCardId: card.giftCardId },
          UpdateExpression: 'SET usedByOrder = :orderId, usedByUser = :userId, usedAt = :usedAt, updatedAt = :updatedAt REMOVE reservedByOrder, reservedByUser, reservedAt, reservationExpiresAt',
          ExpressionAttributeValues: {
            ':orderId': card.usedByOrder,
            ':userId': card.usedByUser,
            ':usedAt': card.usedAt,
            ':updatedAt': card.updatedAt
          },
          ConditionExpression: 'reservedByOrder = :orderId AND attribute_not_exists(usedByOrder)' // Ensure still reserved by this order
        });
        
        await docClient.send(command);
        confirmedCards.push(card);
        
      } catch (error: any) {
        if (error.name === 'ConditionalCheckFailedException') {
          console.warn(`Could not confirm reservation for gift card ${card.giftCardId} - may have been released or expired`);
          continue;
        }
        throw error;
      }
    }

    return confirmedCards;
  }

  /**
   * Release reservations for an order (cleanup on failure)
   */
  async releaseReservations(orderId: string): Promise<GiftCard[]> {
    const reservedCards = await this.findReservedByOrder(orderId);
    const releasedCards: GiftCard[] = [];

    for (const card of reservedCards) {
      try {
        card.releaseReservation();
        
        const command = new UpdateCommand({
          TableName: GIFT_CARD_TABLE,
          Key: { giftCardId: card.giftCardId },
          UpdateExpression: 'REMOVE reservedByOrder, reservedByUser, reservedAt, reservationExpiresAt SET updatedAt = :updatedAt',
          ExpressionAttributeValues: {
            ':updatedAt': card.updatedAt
          },
          ConditionExpression: 'reservedByOrder = :orderId', // Ensure still reserved by this order
          ExpressionAttributeNames: {}
        });
        
        command.input.ExpressionAttributeValues![':orderId'] = orderId;
        
        await docClient.send(command);
        releasedCards.push(card);
        
      } catch (error: any) {
        if (error.name === 'ConditionalCheckFailedException') {
          console.warn(`Could not release reservation for gift card ${card.giftCardId} - may already be released`);
          continue;
        }
        throw error;
      }
    }

    return releasedCards;
  }

  /**
   * Find gift cards reserved by an order
   */
  async findReservedByOrder(orderId: string): Promise<GiftCard[]> {
    const command = new ScanCommand({
      TableName: GIFT_CARD_TABLE,
      FilterExpression: 'reservedByOrder = :orderId',
      ExpressionAttributeValues: {
        ':orderId': orderId
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new GiftCard(item as any));
  }

  /**
   * Clean up expired reservations (should be run periodically)
   */
  async cleanupExpiredReservations(): Promise<number> {
    const now = new Date().toISOString();
    const command = new ScanCommand({
      TableName: GIFT_CARD_TABLE,
      FilterExpression: 'attribute_exists(reservedByOrder) AND reservationExpiresAt < :now',
      ExpressionAttributeValues: {
        ':now': now
      }
    });
    
    const result = await docClient.send(command);
    const expiredReservations = (result.Items || []).map(item => new GiftCard(item as any));
    
    if (expiredReservations.length === 0) {
      return 0; // No cleanup needed
    }
    
    console.log(`Found ${expiredReservations.length} expired reservations to cleanup`);
    
    let cleanedCount = 0;
    for (const card of expiredReservations) {
      try {
        card.releaseReservation();
        
        const updateCommand = new UpdateCommand({
          TableName: GIFT_CARD_TABLE,
          Key: { giftCardId: card.giftCardId },
          UpdateExpression: 'REMOVE reservedByOrder, reservedByUser, reservedAt, reservationExpiresAt SET updatedAt = :updatedAt',
          ExpressionAttributeValues: {
            ':updatedAt': card.updatedAt,
            ':now': now
          },
          ConditionExpression: 'attribute_exists(reservedByOrder) AND reservationExpiresAt < :now'
        });
        
        await docClient.send(updateCommand);
        cleanedCount++;
        
      } catch (error: any) {
        if (error.name === 'ConditionalCheckFailedException') {
          // Already cleaned up, continue
          continue;
        }
        console.error(`Failed to cleanup expired reservation for card ${card.giftCardId}:`, error);
      }
    }
    
    console.log(`Successfully cleaned up ${cleanedCount} expired reservations`);
    return cleanedCount;
  }

  /**
   * Get reservation statistics for monitoring
   */
  async getReservationStats(): Promise<{
    totalReserved: number;
    expiredReservations: number;
    activeReservations: number;
  }> {
    const now = new Date().toISOString();
    const command = new ScanCommand({
      TableName: GIFT_CARD_TABLE,
      FilterExpression: 'attribute_exists(reservedByOrder)',
      ProjectionExpression: 'giftCardId, reservationExpiresAt'
    });
    
    const result = await docClient.send(command);
    const reservations = result.Items || [];
    
    const stats = {
      totalReserved: reservations.length,
      expiredReservations: 0,
      activeReservations: 0
    };
    
    reservations.forEach(item => {
      if (item.reservationExpiresAt && item.reservationExpiresAt < now) {
        stats.expiredReservations++;
      } else {
        stats.activeReservations++;
      }
    });
    
    return stats;
  }

  /**
   * Find expiring soon cards for a variant using GSI (no scan)
   */
  async findExpiringSoonByVariant(variantId: string, daysFromNow: number = 30): Promise<GiftCard[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
    const futureISOString = futureDate.toISOString();
    const nowISOString = now.toISOString();
    
    const command = new QueryCommand({
      TableName: GIFT_CARD_TABLE,
      IndexName: VARIANT_EXPIRY_GSI,
      KeyConditionExpression: 'variantId = :variantId AND expiryTime BETWEEN :now AND :future',
      FilterExpression: 'attribute_not_exists(usedByOrder)', // Only unused cards
      ExpressionAttributeValues: {
        ':variantId': variantId,
        ':now': nowISOString,
        ':future': futureISOString
      },
      ScanIndexForward: true // Sort by expiryTime ascending
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new GiftCard(item as any));
  }

  /**
   * Get variant availability stats using GSI (no scan)
   */
  async getVariantAvailabilityStats(variantId: string): Promise<{
    total: number;
    available: number;
    used: number;
    expired: number;
  }> {
    // Query all cards for this variant using GSI
    const command = new QueryCommand({
      TableName: GIFT_CARD_TABLE,
      IndexName: VARIANT_EXPIRY_GSI,
      KeyConditionExpression: 'variantId = :variantId',
      ExpressionAttributeValues: {
        ':variantId': variantId
      }
    });
    
    const result = await docClient.send(command);
    const giftCards = (result.Items || []).map(item => new GiftCard(item as any));
    
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

  /**
   * Mark gift cards as used by an order (batch operation for better performance)
   */
  async markAsUsedByOrder(giftCards: GiftCard[], orderId: string, userId: string): Promise<GiftCard[]> {
    const updatedCards: GiftCard[] = [];
    
    // Process in batches of 25 (DynamoDB batch limit)
    const batchSize = 25;
    for (let i = 0; i < giftCards.length; i += batchSize) {
      const batch = giftCards.slice(i, i + batchSize);
      
      // Update each card in the batch
      const updatePromises = batch.map(async (giftCard) => {
        giftCard.markAsUsed(orderId, userId);
        
        const command = new UpdateCommand({
          TableName: GIFT_CARD_TABLE,
          Key: { giftCardId: giftCard.giftCardId },
          UpdateExpression: 'SET usedByOrder = :orderId, usedByUser = :userId, usedAt = :usedAt, updatedAt = :updatedAt',
          ExpressionAttributeValues: {
            ':orderId': giftCard.usedByOrder,
            ':userId': giftCard.usedByUser,
            ':usedAt': giftCard.usedAt,
            ':updatedAt': giftCard.updatedAt
          },
          ConditionExpression: 'attribute_not_exists(usedByOrder)' // Ensure card isn't already used
        });
        
        try {
          await docClient.send(command);
          updatedCards.push(giftCard);
        } catch (error: any) {
          if (error.name === 'ConditionalCheckFailedException') {
            throw new Error(`Gift card ${giftCard.giftCardId} is already used`);
          }
          throw error;
        }
      });
      
      await Promise.all(updatePromises);
    }
    
    return updatedCards;
  }

  /**
   * Release gift cards back to available pool (batch operation)
   */
  async releaseGiftCards(orderId: string): Promise<GiftCard[]> {
    const usedCards = await this.findByOrderId(orderId);
    const releasedCards: GiftCard[] = [];
    
    // Process in batches
    const batchSize = 25;
    for (let i = 0; i < usedCards.length; i += batchSize) {
      const batch = usedCards.slice(i, i + batchSize);
      
      const updatePromises = batch.map(async (giftCard) => {
        giftCard.release();
        
        const command = new UpdateCommand({
          TableName: GIFT_CARD_TABLE,
          Key: { giftCardId: giftCard.giftCardId },
          UpdateExpression: 'REMOVE usedByOrder, usedByUser, usedAt SET updatedAt = :updatedAt',
          ExpressionAttributeValues: {
            ':updatedAt': giftCard.updatedAt
          },
          ConditionExpression: 'usedByOrder = :orderId', // Ensure card belongs to this order
          ExpressionAttributeNames: {}
        });
        
        // Add orderId to condition
        command.input.ExpressionAttributeValues![':orderId'] = orderId;
        
        try {
          await docClient.send(command);
          releasedCards.push(giftCard);
        } catch (error: any) {
          if (error.name === 'ConditionalCheckFailedException') {
            // Card might already be released or belong to different order
            console.warn(`Could not release gift card ${giftCard.giftCardId} - condition failed`);
          } else {
            throw error;
          }
        }
      });
      
      await Promise.all(updatePromises);
    }
    
    return releasedCards;
  }

  async save(giftCard: GiftCard): Promise<GiftCard> {
    const command = new PutCommand({
      TableName: GIFT_CARD_TABLE,
      Item: giftCard
    });
    
    await docClient.send(command);
    return giftCard;
  }

  /**
   * Find expired cards - this requires a scan as we need to check all variants
   * Consider running this as a scheduled job rather than real-time queries
   */
  async findExpiredCards(): Promise<GiftCard[]> {
    const now = new Date().toISOString();
    const command = new ScanCommand({
      TableName: GIFT_CARD_TABLE,
      FilterExpression: 'expiryTime <= :now',
      ExpressionAttributeValues: {
        ':now': now
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new GiftCard(item as any));
  }

  // Batch operations for better performance
  async batchCreate(giftCards: GiftCard[]): Promise<GiftCard[]> {
    const batchSize = 25; // DynamoDB batch write limit
    const createdCards: GiftCard[] = [];
    
    for (let i = 0; i < giftCards.length; i += batchSize) {
      const batch = giftCards.slice(i, i + batchSize);
      
      const command = new BatchWriteCommand({
        RequestItems: {
          [GIFT_CARD_TABLE]: batch.map(card => ({
            PutRequest: {
              Item: card
            }
          }))
        }
      });
      
      await docClient.send(command);
      createdCards.push(...batch);
    }
    
    return createdCards;
  }

  async delete(giftCard: GiftCard): Promise<void> {
    const command = new DeleteCommand({
      TableName: GIFT_CARD_TABLE,
      Key: { giftCardId: giftCard.giftCardId },
      ConditionExpression: 'attribute_not_exists(usedByOrder)' // Prevent deleting used cards
    });
    
    try {
      await docClient.send(command);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Cannot delete a used gift card');
      }
      throw error;
    }
  }

  // Validation methods
  async validateAvailability(variantId: string, quantity: number): Promise<void> {
    const availableCards = await this.findAvailableByVariant(variantId, quantity);
    if (availableCards.length < quantity) {
      throw new Error(`Only ${availableCards.length} gift cards available for variant ${variantId}, but ${quantity} requested`);
    }
  }

  /**
   * Get gift cards that are about to expire across all variants
   * This is a scan operation - consider running as a scheduled job
   */
  async findAllExpiringSoonCards(daysFromNow: number = 30): Promise<GiftCard[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
    const futureISOString = futureDate.toISOString();
    const nowISOString = now.toISOString();
    
    const command = new ScanCommand({
      TableName: GIFT_CARD_TABLE,
      FilterExpression: 'attribute_not_exists(usedByOrder) AND expiryTime > :now AND expiryTime <= :future',
      ExpressionAttributeValues: {
        ':now': nowISOString,
        ':future': futureISOString
      }
    });
    
    const result = await docClient.send(command);
    const giftCards = (result.Items || []).map(item => new GiftCard(item as any));
    giftCards.sort((a, b) => a.expiryTime.localeCompare(b.expiryTime));
    
    return giftCards;
  }
}

export const giftCardRepository = new GiftCardRepository(); 