import { ulid } from 'ulid';

// GiftCard class - exact DynamoDB item structure with constructor and methods
export class GiftCard {
  readonly giftCardId: string;       // ULID - Primary Key (immutable)
  readonly productId: string;        // Product reference (immutable)
  readonly variantId: string;        // Variant reference (immutable) - GSI1 PK
  readonly productName: string;      // Product name (immutable)
  readonly variantName: string;      // Variant name (immutable)
  readonly denomination: number;     // Face value in rupees (immutable)
  readonly giftCardNumber: string;   // Encrypted card number (immutable)
  readonly giftCardPin: string;      // Encrypted PIN (immutable)
  readonly expiryTime: string;       // ISO timestamp when card expires (immutable) - GSI1 SK
  readonly purchasePrice: number;    // Purchase price in cents/paise (immutable)
  readonly createdAt: string;        // ISO timestamp (immutable)
  
  usedByOrder?: string;              // Order ID if used - GSI2 PK
  usedByUser?: string;               // User ID if used - GSI3 PK
  usedAt?: string;                   // ISO timestamp when used
  updatedAt: string;                 // ISO timestamp

  constructor(data: {
    giftCardId: string;
    productId: string;
    variantId: string;
    productName: string;
    variantName: string;
    denomination: number;
    giftCardNumber: string;
    giftCardPin: string;
    expiryTime: string;
    purchasePrice: number;
    usedByOrder?: string;
    usedByUser?: string;
    usedAt?: string;
    createdAt?: string;
    updatedAt?: string;
  }) {
    // Validate required fields
    this.validateRequiredFields(data);
    
    // Immutable fields
    this.giftCardId = data.giftCardId;
    this.productId = data.productId;
    this.variantId = data.variantId;
    this.productName = this.validateName(data.productName, 'product name');
    this.variantName = this.validateName(data.variantName, 'variant name');
    this.denomination = this.validateDenomination(data.denomination);
    this.giftCardNumber = data.giftCardNumber; // Assumed to be already encrypted
    this.giftCardPin = data.giftCardPin; // Assumed to be already encrypted
    this.expiryTime = this.validateExpiryTime(data.expiryTime);
    this.purchasePrice = this.validatePrice(data.purchasePrice);
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    // Mutable fields
    this.usedByOrder = data.usedByOrder;
    this.usedByUser = data.usedByUser;
    this.usedAt = data.usedAt;
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
  }

  // Create new gift card instance with validation
  static create(data: {
    productId: string;
    variantId: string;
    productName: string;
    variantName: string;
    denomination: number;
    giftCardNumber: string;
    giftCardPin: string;
    purchasePrice: number;
    expiryYears?: number; // Defaults to 1 year
  }): GiftCard {
    const expiryTime = GiftCard.generateExpiryTime(data.expiryYears);
    
    return new GiftCard({
      giftCardId: ulid(),
      expiryTime,
      ...data
    });
  }

  // Mark gift card as used
  markAsUsed(orderId: string, userId: string): GiftCard {
    if (this.isUsed) {
      throw new Error('Gift card is already used');
    }
    
    if (this.isExpired) {
      throw new Error('Gift card has expired');
    }

    this.usedByOrder = orderId;
    this.usedByUser = userId;
    this.usedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Release gift card (mark as unused)
  release(): GiftCard {
    if (!this.isUsed) {
      throw new Error('Gift card is not currently used');
    }

    this.usedByOrder = undefined;
    this.usedByUser = undefined;
    this.usedAt = undefined;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Computed properties
  get isUsed(): boolean {
    return !!this.usedByOrder;
  }

  get isAvailable(): boolean {
    return !this.isUsed && !this.isExpired;
  }

  get isExpired(): boolean {
    return new Date(this.expiryTime) <= new Date();
  }

  get daysUntilExpiry(): number {
    const now = new Date();
    const expiry = new Date(this.expiryTime);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get isExpiringSoon(): boolean {
    return this.daysUntilExpiry <= 30 && this.daysUntilExpiry > 0;
  }

  // Get formatted values for display
  get formattedDenomination(): string {
    return `₹${this.denomination.toLocaleString('en-IN')}`;
  }

  get formattedPurchasePrice(): string {
    const priceInRupees = this.purchasePrice / 100;
    return `₹${priceInRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  get formattedExpiryDate(): string {
    return new Date(this.expiryTime).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Get card status summary
  getStatus(): {
    status: 'AVAILABLE' | 'USED' | 'EXPIRED';
    isUsed: boolean;
    isExpired: boolean;
    isExpiringSoon: boolean;
    daysUntilExpiry: number;
  } {
    let status: 'AVAILABLE' | 'USED' | 'EXPIRED';
    
    if (this.isExpired) {
      status = 'EXPIRED';
    } else if (this.isUsed) {
      status = 'USED';
    } else {
      status = 'AVAILABLE';
    }

    return {
      status,
      isUsed: this.isUsed,
      isExpired: this.isExpired,
      isExpiringSoon: this.isExpiringSoon,
      daysUntilExpiry: this.daysUntilExpiry
    };
  }

  // Static utility methods
  static generateExpiryTime(years: number = 1): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + years);
    return date.toISOString();
  }

  // Private validation methods
  private validateRequiredFields(data: any): void {
    const required = [
      'giftCardId', 'productId', 'variantId', 'productName', 'variantName',
      'denomination', 'giftCardNumber', 'giftCardPin', 'expiryTime', 'purchasePrice'
    ];
    
    for (const field of required) {
      if (data[field] === undefined || data[field] === null) {
        throw new Error(`${field} is required`);
      }
    }
  }

  private validateName(name: string, fieldName: string): string {
    if (!name || name.trim().length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }
    if (name.length > 100) {
      throw new Error(`${fieldName} cannot exceed 100 characters`);
    }
    return name.trim();
  }

  private validateDenomination(denomination: number): number {
    if (denomination <= 0) {
      throw new Error('Denomination must be positive');
    }
    if (!Number.isInteger(denomination)) {
      throw new Error('Denomination must be a whole number');
    }
    return denomination;
  }

  private validatePrice(price: number): number {
    if (price <= 0) {
      throw new Error('Purchase price must be positive');
    }
    if (!Number.isInteger(price)) {
      throw new Error('Purchase price must be an integer (in paise)');
    }
    return price;
  }

  private validateExpiryTime(expiryTime: string): string {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    if (!isoRegex.test(expiryTime)) {
      throw new Error('Expiry time must be a valid ISO timestamp');
    }
    
    const expiryDate = new Date(expiryTime);
    if (isNaN(expiryDate.getTime())) {
      throw new Error('Invalid expiry time');
    }
    
    return expiryTime;
  }
}

// Table configuration
export const GIFT_CARD_TABLE = process.env.GIFT_CARDS_TABLE || 'giftify-gift-cards';

// GSI configurations for optimized queries
export const VARIANT_EXPIRY_GSI = 'VariantExpiryIndex';        // variantId + expiryTime
export const ORDER_CARDS_GSI = 'OrderCardsIndex';              // usedByOrder
export const USER_CARDS_GSI = 'UserCardsIndex';                // usedByUser 