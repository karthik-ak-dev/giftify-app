export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  stockAvailable: number;
  imageUrl?: string;
  denomination: number;
}

export interface Cart {
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

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
}

export interface CartActions {
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearError: () => void;
}

export interface AddToCartRequest {
  variantId: string;
  quantity: number;
}

export interface UpdateCartRequest {
  variantId: string;
  quantity: number;
} 