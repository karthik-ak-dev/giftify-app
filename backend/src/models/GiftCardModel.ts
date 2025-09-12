import { GiftCard } from '../types/giftCard';

export class GiftCardModel {
  static readonly tableName = process.env.GIFT_CARDS_TABLE || 'giftify-gift-cards';
  
  // Primary Key
  static readonly partitionKey = 'giftCardId';
  
  // GSI Keys
  static readonly userGiftCardsGSI = 'UserGiftCardsIndex';
  static readonly userGiftCardsGSIPartitionKey = 'userId';
  static readonly userGiftCardsGSISortKey = 'issuedAt';
  
  static readonly orderGiftCardsGSI = 'OrderGiftCardsIndex';
  static readonly orderGiftCardsGSIPartitionKey = 'orderId';
  static readonly orderGiftCardsGSISortKey = 'giftCardId';
  
  static readonly giftCardNumberGSI = 'GiftCardNumberIndex';
  static readonly giftCardNumberGSIKey = 'giftCardNumber';
  
  // Table schema definition
  static readonly schema = {
    giftCardId: 'string',       // ULID - Primary Key
    orderId: 'string',          // GSI2 Partition Key
    userId: 'string',           // GSI1 Partition Key
    productId: 'string',
    variantId: 'string',
    productName: 'string',
    variantName: 'string',
    denomination: 'number',     // Face value in rupees
    giftCardNumber: 'string',   // Encrypted - GSI3 Partition Key
    giftCardPin: 'string',      // Encrypted
    expiryDate: 'string',       // Date string (YYYY-MM-DD)
    status: 'string',           // ACTIVE, REDEEMED, EXPIRED, CANCELLED
    purchasePrice: 'number',    // Purchase price in cents/paise
    issuedAt: 'string',         // ISO timestamp - GSI1 Sort Key
    redeemedAt: 'string',       // Optional - ISO timestamp
    createdAt: 'string',        // ISO timestamp
    updatedAt: 'string'         // ISO timestamp
  };
  
  // Default values
  static readonly defaults = {
    status: 'ACTIVE'
  };
  
  // Validation rules
  static readonly validation = {
    status: {
      required: true,
      enum: ['ACTIVE', 'REDEEMED', 'EXPIRED', 'CANCELLED']
    },
    denomination: {
      required: true,
      min: 1
    },
    purchasePrice: {
      required: true,
      min: 1
    },
    expiryDate: {
      required: true,
      pattern: /^\d{4}-\d{2}-\d{2}$/
    }
  };
  
  // Transform DB item to GiftCard interface
  static toGiftCard(item: any): GiftCard {
    return {
      giftCardId: item.giftCardId,
      orderId: item.orderId,
      userId: item.userId,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName,
      variantName: item.variantName,
      denomination: item.denomination,
      giftCardNumber: item.giftCardNumber,
      giftCardPin: item.giftCardPin,
      expiryDate: item.expiryDate,
      status: item.status,
      purchasePrice: item.purchasePrice,
      issuedAt: item.issuedAt,
      redeemedAt: item.redeemedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }
  
  // Generate expiry date (1 year from now)
  static generateExpiryDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }
} 