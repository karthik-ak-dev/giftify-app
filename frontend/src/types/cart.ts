/**
 * Cart Types
 * Based on backend cart types
 */

// Cart Item with Stock from backend
export interface CartItem {
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

// Cart Summary from backend
export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  totalAmountFormatted: string;
}

// Manage Cart Request
export interface ManageCartRequest {
  variantId: string;
  action: 'ADD' | 'UPDATE' | 'REMOVE';
  quantity?: number;
} 