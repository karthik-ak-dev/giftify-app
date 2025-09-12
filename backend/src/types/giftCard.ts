// Gift Card types
export interface GiftCard {
  giftCardId: string;
  orderId: string;
  userId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  denomination: number;
  giftCardNumber: string;
  giftCardPin: string;
  expiryDate: string;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED';
  purchasePrice: number;
  issuedAt: string;
  redeemedAt?: string;
  createdAt: string;
  updatedAt: string;
} 