export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  totalAmountFormatted: string;
} 

export interface CartItemWithStock {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  stockAvailable: number;
  isInStock: boolean;
}
