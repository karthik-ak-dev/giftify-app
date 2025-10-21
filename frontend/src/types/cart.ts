export interface CartItem {
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

export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  totalAmountFormatted: string;
}

export interface Cart {
  items: CartItem[];
  summary: CartSummary;
  hasOutOfStockItems: boolean;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
  message: string;
}

export interface ManageCartRequest {
  variantId: string;
  quantity: number;
}

export interface ManageCartResponse {
  success: boolean;
  data: {
    message: string;
    cartSummary: CartSummary;
    item: Omit<CartItem, 'stockAvailable' | 'isInStock'>;
  };
  message: string;
}

