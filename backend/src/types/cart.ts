// Cart types
export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  totalAmountFormatted: string;
} 