import { PutCommand, GetCommand, DeleteCommand, ScanCommand, UpdateCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { GiftCard, GIFT_CARD_TABLE } from '../models/GiftCardModel';
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

  async findByOrderId(orderId: string): Promise<GiftCard[]> {
    const command = new ScanCommand({
      TableName: GIFT_CARD_TABLE,
      FilterExpression: 'usedByOrder = :orderId',
      ExpressionAttributeValues: {
        ':orderId': orderId
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new GiftCard(item as any));
  }

  async findByUserId(userId: string): Promise<GiftCard[]> {
    const command = new ScanCommand({
      TableName: GIFT_CARD_TABLE,
      FilterExpression: 'usedByUser = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new GiftCard(item as any));
  }

  /**
   * Find available (unused and not expired) gift cards for a specific variant
   * Returns cards sorted by expiry time (expiring first) for FIFO allocation
   */
  async findAvailableByVariant(variantId: string, quantity: number): Promise<GiftCard[]> {
    const now = new Date().toISOString();
    
    const command = new ScanCommand({
      TableName: GIFT_CARD_TABLE,
      FilterExpression: 'variantId = :variantId AND attribute_not_exists(usedByOrder) AND expiryTime > :now',
      ExpressionAttributeValues: {
        ':variantId': variantId,
        ':now': now
      },
      Limit: quantity * 2 // Get more than needed for sorting
    });
    
    const result = await docClient.send(command);
    
    // Convert to GiftCard instances and sort by expiry time (FIFO)
    const giftCards = (result.Items || []).map(item => new GiftCard(item as any));
    giftCards.sort((a, b) => a.expiryTime.localeCompare(b.expiryTime));
    
    return giftCards.slice(0, quantity);
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
          ExpressionAttributeNames: {
            '#orderId': 'usedByOrder'
          }
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

  // Business query methods with optimized scans
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

  async findExpiringSoonByVariant(variantId: string, daysFromNow: number = 30): Promise<GiftCard[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
    const futureISOString = futureDate.toISOString();
    const nowISOString = now.toISOString();
    
    const command = new ScanCommand({
      TableName: GIFT_CARD_TABLE,
      FilterExpression: 'variantId = :variantId AND attribute_not_exists(usedByOrder) AND expiryTime > :now AND expiryTime <= :future',
      ExpressionAttributeValues: {
        ':variantId': variantId,
        ':now': nowISOString,
        ':future': futureISOString
      }
    });
    
    const result = await docClient.send(command);
    const giftCards = (result.Items || []).map(item => new GiftCard(item as any));
    giftCards.sort((a, b) => a.expiryTime.localeCompare(b.expiryTime));
    
    return giftCards;
  }

  async getVariantAvailabilityStats(variantId: string): Promise<{
    total: number;
    available: number;
    used: number;
    expired: number;
  }> {
    const command = new ScanCommand({
      TableName: GIFT_CARD_TABLE,
      FilterExpression: 'variantId = :variantId',
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

  async findByProductId(productId: string): Promise<GiftCard[]> {
    const command = new ScanCommand({
      TableName: GIFT_CARD_TABLE,
      FilterExpression: 'productId = :productId',
      ExpressionAttributeValues: {
        ':productId': productId
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
}

export const giftCardRepository = new GiftCardRepository(); 