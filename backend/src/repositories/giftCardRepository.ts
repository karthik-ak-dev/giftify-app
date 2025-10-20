import { PutCommand, ScanCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { GiftCard, GIFT_CARD_TABLE, VARIANT_EXPIRY_GSI, ORDER_CARDS_GSI } from '../models/GiftCardModel';
import { docClient } from '../utils/database';

export class GiftCardRepository {
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

  async findAvailableByVariant(variantId: string, quantity: number): Promise<GiftCard[]> {
    const now = new Date().toISOString();
    
    const command = new QueryCommand({
      TableName: GIFT_CARD_TABLE,
      IndexName: VARIANT_EXPIRY_GSI,
      KeyConditionExpression: 'variantId = :variantId AND expiryTime > :now',
      FilterExpression: 'attribute_not_exists(usedByOrder) AND (attribute_not_exists(reservedByOrder) OR reservationExpiresAt < :now)',
      ExpressionAttributeValues: {
        ':variantId': variantId,
        ':now': now
      },
      Limit: quantity,
      ScanIndexForward: true
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new GiftCard(item as any));
  }

  async reserveGiftCards(variantId: string, quantity: number, orderId: string, userId: string, reservationMinutes: number = 10): Promise<GiftCard[]> {
    const reservedCards: GiftCard[] = [];
    const now = new Date().toISOString();
    const availableCards = await this.findAvailableByVariant(variantId, Math.max(quantity * 2, 50));
    
    if (availableCards.length === 0) {
      return [];
    }

    for (const card of availableCards) {
      if (reservedCards.length >= quantity) {
        break;
      }

      try {
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
          ConditionExpression: 'attribute_not_exists(usedByOrder) AND (attribute_not_exists(reservedByOrder) OR reservationExpiresAt < :now) AND expiryTime > :now'
        });
        
        await docClient.send(command);
        reservedCards.push(card);
        
      } catch (error: any) {
        if (error.name === 'ConditionalCheckFailedException') {
          console.log(`Gift card ${card.giftCardId} was already reserved/used by another request`);
          continue;
        }
        console.warn(`Failed to reserve gift card ${card.giftCardId}:`, error.message);
        continue;
      }
    }

    console.log(`Reserved ${reservedCards.length} out of ${quantity} requested gift cards for variant ${variantId}`);
    return reservedCards;
  }

  async confirmReservations(orderId: string): Promise<GiftCard[]> {
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
          ConditionExpression: 'reservedByOrder = :orderId AND attribute_not_exists(usedByOrder)'
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
          ConditionExpression: 'reservedByOrder = :orderId',
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

  async releaseGiftCards(orderId: string): Promise<GiftCard[]> {
    const usedCards = await this.findByOrderId(orderId);
    const releasedCards: GiftCard[] = [];
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
          ConditionExpression: 'usedByOrder = :orderId',
          ExpressionAttributeNames: {}
        });
        
        command.input.ExpressionAttributeValues![':orderId'] = orderId;
        
        try {
          await docClient.send(command);
          releasedCards.push(giftCard);
        } catch (error: any) {
          if (error.name === 'ConditionalCheckFailedException') {
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
}

export const giftCardRepository = new GiftCardRepository();
