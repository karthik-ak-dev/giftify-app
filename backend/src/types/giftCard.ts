// Gift Card types
export interface GiftCard {
  giftCardId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  denomination: number;
  giftCardNumber: string;
  giftCardPin: string;
  expiryTime: string;        // ISO timestamp when card expires
  purchasePrice: number;
  usedByOrder?: string;      // Order ID if used, null/undefined if available
  usedByUser?: string;       // User ID if used, null/undefined if available
  usedAt?: string;           // ISO timestamp when used
  createdAt: string;
  updatedAt: string;
} 