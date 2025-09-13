import { GiftCard } from '../types/giftCard';

export class GiftCardModel {
  static readonly tableName = process.env.GIFT_CARDS_TABLE || 'giftify-gift-cards';
  
  // Primary Key
  static readonly partitionKey = 'giftCardId';
  
  // GSI Keys
  static readonly variantGSI = 'VariantIndex';
  static readonly variantGSIPartitionKey = 'variantId';
  static readonly variantGSISortKey = 'createdAt';
  
  static readonly giftCardNumberGSI = 'GiftCardNumberIndex';
  static readonly giftCardNumberGSIKey = 'giftCardNumber';
  
  // Table schema definition
  static readonly schema = {
    giftCardId: 'string',       // ULID - Primary Key
    productId: 'string',
    variantId: 'string',        // GSI1 Partition Key
    productName: 'string',
    variantName: 'string',
    denomination: 'number',     // Face value in rupees
    giftCardNumber: 'string',   // Encrypted - GSI2 Partition Key
    giftCardPin: 'string',      // Encrypted
    expiryTime: 'string',       // ISO timestamp when card expires
    purchasePrice: 'number',    // Purchase price in cents/paise
    usedByOrder: 'string',      // Optional - Order ID if used
    usedByUser: 'string',       // Optional - User ID if used
    usedAt: 'string',           // Optional - ISO timestamp when used
    createdAt: 'string',        // ISO timestamp - GSI1 Sort Key
    updatedAt: 'string'         // ISO timestamp
  };
  
  // Validation rules
  static readonly validation = {
    denomination: {
      required: true,
      min: 1
    },
    purchasePrice: {
      required: true,
      min: 1
    },
    expiryTime: {
      required: true,
      pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/
    }
  };
  
  // Transform DB item to GiftCard interface
  static toGiftCard(item: any): GiftCard {
    return {
      giftCardId: item.giftCardId,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName,
      variantName: item.variantName,
      denomination: item.denomination,
      giftCardNumber: item.giftCardNumber,
      giftCardPin: item.giftCardPin,
      expiryTime: item.expiryTime,
      purchasePrice: item.purchasePrice,
      usedByOrder: item.usedByOrder,
      usedByUser: item.usedByUser,
      usedAt: item.usedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }
  
  // Generate expiry time (1 year from now)
  static generateExpiryTime(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString(); // Full ISO timestamp
  }
} 