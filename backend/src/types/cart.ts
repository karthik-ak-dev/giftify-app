export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  totalAmountFormatted: string;
} 

export interface CartItemWithStock {
  brandId: string;
  brandName: string;
  brandLogo: string;
  variantId: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  stockAvailable: number;
  isInStock: boolean;
}
