import { ulid } from 'ulid';

export interface CartItem {
  brandId: string;
  brandName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export class Cart {
  readonly userId: string;
  readonly createdAt: string;
  
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  updatedAt: string;

  constructor(data: {
    userId: string;
    items?: CartItem[];
    totalAmount?: number;
    totalItems?: number;
    createdAt?: string;
    updatedAt?: string;
  }) {
    this.validateRequiredFields(data);
    
    this.userId = data.userId;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    this.items = data.items ? this.validateItems(data.items) : [];
    this.totalAmount = data.totalAmount ?? 0;
    this.totalItems = data.totalItems ?? 0;
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
    
    this.recalculateTotals();
  }

  static create(userId: string): Cart {
    return new Cart({ userId });
  }

  addItem(item: Omit<CartItem, 'totalPrice'>): Cart {
    const validatedItem = this.validateCartItem(item);
    const cartItem: CartItem = {
      ...validatedItem,
      totalPrice: validatedItem.quantity * validatedItem.unitPrice
    };

    const existingItemIndex = this.items.findIndex(
      existing => existing.variantId === cartItem.variantId
    );

    if (existingItemIndex >= 0) {
      this.items[existingItemIndex].quantity += cartItem.quantity;
      this.items[existingItemIndex].totalPrice = 
        this.items[existingItemIndex].quantity * this.items[existingItemIndex].unitPrice;
    } else {
      this.items.push(cartItem);
    }

    this.recalculateTotals();
    this.updatedAt = new Date().toISOString();
    return this;
  }

  updateItemQuantity(variantId: string, quantity: number): Cart {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    const itemIndex = this.items.findIndex(item => item.variantId === variantId);
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    this.items[itemIndex].quantity = quantity;
    this.items[itemIndex].totalPrice = quantity * this.items[itemIndex].unitPrice;

    this.recalculateTotals();
    this.updatedAt = new Date().toISOString();
    return this;
  }

  removeItem(variantId: string): Cart {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.variantId !== variantId);
    
    if (this.items.length === initialLength) {
      throw new Error('Item not found in cart');
    }

    this.recalculateTotals();
    this.updatedAt = new Date().toISOString();
    return this;
  }

  clear(): Cart {
    this.items = [];
    this.totalAmount = 0;
    this.totalItems = 0;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  hasItem(variantId: string): boolean {
    return this.items.some(item => item.variantId === variantId);
  }

  get formattedTotalAmount(): string {
    const amountInRupees = this.totalAmount / 100;
    return `₹${amountInRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  private recalculateTotals(): void {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  private validateRequiredFields(data: any): void {
    if (!data.userId) {
      throw new Error('userId is required');
    }
  }

  private validateItems(items: CartItem[]): CartItem[] {
    return items.map(item => this.validateCartItem(item));
  }

  private validateCartItem(item: any): CartItem {
    const required = ['brandId', 'brandName', 'variantId', 'variantName', 'quantity', 'unitPrice'];
    for (const field of required) {
      if (!item[field]) {
        throw new Error(`Cart item ${field} is required`);
      }
    }

    if (item.quantity <= 0) {
      throw new Error('Cart item quantity must be positive');
    }

    if (item.unitPrice <= 0) {
      throw new Error('Cart item unit price must be positive');
    }

    if (!Number.isInteger(item.quantity)) {
      throw new Error('Cart item quantity must be an integer');
    }

    if (!Number.isInteger(item.unitPrice)) {
      throw new Error('Cart item unit price must be an integer (in paise)');
    }

    if (item.brandName.trim().length === 0) {
      throw new Error('Cart item brand name cannot be empty');
    }

    if (item.variantName.trim().length === 0) {
      throw new Error('Cart item variant name cannot be empty');
    }

    return {
      brandId: item.brandId,
      brandName: item.brandName.trim(),
      variantId: item.variantId,
      variantName: item.variantName.trim(),
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice || (item.quantity * item.unitPrice)
    };
  }
}

export const CART_TABLE = process.env.CART_TABLE || 'giftify-cart';
