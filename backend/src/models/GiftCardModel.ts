export class GiftCard {
  readonly giftCardId: string;
  readonly brandId: string;
  readonly variantId: string;
  readonly brandName: string;
  readonly variantName: string;
  readonly denomination: number;
  readonly giftCardNumber: string;
  readonly giftCardPin: string;
  readonly expiryTime: string;
  readonly purchasePrice: number;
  readonly createdAt: string;
  
  usedByOrder?: string;
  usedByUser?: string;
  usedAt?: string;
  reservedByOrder?: string;
  reservedByUser?: string;
  reservedAt?: string;
  reservationExpiresAt?: string;
  updatedAt: string;

  constructor(data: {
    giftCardId: string;
    brandId: string;
    variantId: string;
    brandName: string;
    variantName: string;
    denomination: number;
    giftCardNumber: string;
    giftCardPin: string;
    expiryTime: string;
    purchasePrice: number;
    usedByOrder?: string;
    usedByUser?: string;
    usedAt?: string;
    reservedByOrder?: string;
    reservedByUser?: string;
    reservedAt?: string;
    reservationExpiresAt?: string;
    createdAt?: string;
    updatedAt?: string;
  }) {
    this.validateRequiredFields(data);
    
    this.giftCardId = data.giftCardId;
    this.brandId = data.brandId;
    this.variantId = data.variantId;
    this.brandName = this.validateName(data.brandName, 'brand name');
    this.variantName = this.validateName(data.variantName, 'variant name');
    this.denomination = this.validateDenomination(data.denomination);
    this.giftCardNumber = data.giftCardNumber;
    this.giftCardPin = data.giftCardPin;
    this.expiryTime = this.validateExpiryTime(data.expiryTime);
    this.purchasePrice = this.validatePrice(data.purchasePrice);
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    this.usedByOrder = data.usedByOrder;
    this.usedByUser = data.usedByUser;
    this.usedAt = data.usedAt;
    this.reservedByOrder = data.reservedByOrder;
    this.reservedByUser = data.reservedByUser;
    this.reservedAt = data.reservedAt;
    this.reservationExpiresAt = data.reservationExpiresAt;
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
  }

  reserve(orderId: string, userId: string, reservationMinutes: number = 10): GiftCard {
    if (this.isUsed) {
      throw new Error('Gift card is already used');
    }
    
    if (this.isReserved && !this.isReservationExpired) {
      throw new Error('Gift card is already reserved');
    }
    
    if (this.isExpired) {
      throw new Error('Gift card has expired');
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + (reservationMinutes * 60 * 1000));

    this.reservedByOrder = orderId;
    this.reservedByUser = userId;
    this.reservedAt = now.toISOString();
    this.reservationExpiresAt = expiresAt.toISOString();
    this.updatedAt = now.toISOString();
    return this;
  }

  confirmReservation(): GiftCard {
    if (!this.isReserved) {
      throw new Error('Gift card is not reserved');
    }
    
    if (this.isReservationExpired) {
      throw new Error('Reservation has expired');
    }

    this.usedByOrder = this.reservedByOrder;
    this.usedByUser = this.reservedByUser;
    this.usedAt = new Date().toISOString();
    
    this.reservedByOrder = undefined;
    this.reservedByUser = undefined;
    this.reservedAt = undefined;
    this.reservationExpiresAt = undefined;
    
    this.updatedAt = new Date().toISOString();
    return this;
  }

  releaseReservation(): GiftCard {
    if (!this.isReserved) {
      throw new Error('Gift card is not reserved');
    }

    this.reservedByOrder = undefined;
    this.reservedByUser = undefined;
    this.reservedAt = undefined;
    this.reservationExpiresAt = undefined;
    this.updatedAt = new Date().toISOString();
    return this;
  }

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

  get isUsed(): boolean {
    return !!this.usedByOrder;
  }

  get isReserved(): boolean {
    return !!this.reservedByOrder;
  }

  get isReservationExpired(): boolean {
    if (!this.isReserved || !this.reservationExpiresAt) {
      return false;
    }
    return new Date(this.reservationExpiresAt) <= new Date();
  }

  get isExpired(): boolean {
    return new Date(this.expiryTime) <= new Date();
  }

  private validateRequiredFields(data: any): void {
    const required = [
      'giftCardId', 'brandId', 'variantId', 'brandName', 'variantName',
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

export const GIFT_CARD_TABLE = process.env.GIFT_CARDS_TABLE as string;
export const VARIANT_EXPIRY_GSI = 'VariantExpiryIndex';
export const ORDER_CARDS_GSI = 'OrderCardsIndex';
export const USER_CARDS_GSI = 'UserCardsIndex';
