import { ulid } from 'ulid';

// Cart item interface for type safety
export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;        // In cents/paise
  totalPrice: number;       // In cents/paise
}

// Cart class - exact DynamoDB item structure with constructor and methods
export class Cart {
  readonly userId: string;           // Primary Key (immutable)
  readonly createdAt: string;        // ISO timestamp (immutable)
  
  items: CartItem[];
  totalAmount: number;               // Sum of all item totalPrices in cents/paise
  totalItems: number;                // Sum of all quantities
  updatedAt: string;                 // ISO timestamp

  constructor(data: {
    userId: string;
    items?: CartItem[];
    totalAmount?: number;
    totalItems?: number;
    createdAt?: string;
    updatedAt?: string;
  }) {
    // Validate required fields
    this.validateRequiredFields(data);
    
    // Immutable fields
    this.userId = data.userId;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    // Mutable fields
    this.items = data.items ? this.validateItems(data.items) : [];
    this.totalAmount = data.totalAmount ?? 0;
    this.totalItems = data.totalItems ?? 0;
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
    
    // Recalculate totals to ensure consistency
    this.recalculateTotals();
  }

  // Create new cart instance
  static create(userId: string): Cart {
    return new Cart({ userId });
  }

  // Add item to cart
  addItem(item: Omit<CartItem, 'totalPrice'>): Cart {
    const validatedItem = this.validateCartItem(item);
    const cartItem: CartItem = {
      ...validatedItem,
      totalPrice: validatedItem.quantity * validatedItem.unitPrice
    };

    // Check if item already exists
    const existingItemIndex = this.items.findIndex(
      existing => existing.variantId === cartItem.variantId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      this.items[existingItemIndex].quantity += cartItem.quantity;
      this.items[existingItemIndex].totalPrice = 
        this.items[existingItemIndex].quantity * this.items[existingItemIndex].unitPrice;
    } else {
      // Add new item
      this.items.push(cartItem);
    }

    this.recalculateTotals();
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Update item quantity
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

  // Remove item from cart
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

  // Clear all items from cart
  clear(): Cart {
    this.items = [];
    this.totalAmount = 0;
    this.totalItems = 0;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Get item by variant ID
  getItem(variantId: string): CartItem | undefined {
    return this.items.find(item => item.variantId === variantId);
  }

  // Check if cart contains item
  hasItem(variantId: string): boolean {
    return this.items.some(item => item.variantId === variantId);
  }

  // Computed properties
  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  get itemCount(): number {
    return this.items.length;
  }

  // Get formatted total amount for display
  get formattedTotalAmount(): string {
    const amountInRupees = this.totalAmount / 100;
    return `₹${amountInRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  // Get cart summary
  getSummary(): {
    itemCount: number;
    totalItems: number;
    totalAmount: number;
    formattedTotalAmount: string;
  } {
    return {
      itemCount: this.itemCount,
      totalItems: this.totalItems,
      totalAmount: this.totalAmount,
      formattedTotalAmount: this.formattedTotalAmount
    };
  }

  // Private methods
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
    const required = ['variantId', 'productId', 'productName', 'variantName', 'quantity', 'unitPrice'];
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

    if (item.productName.trim().length === 0) {
      throw new Error('Cart item product name cannot be empty');
    }

    if (item.variantName.trim().length === 0) {
      throw new Error('Cart item variant name cannot be empty');
    }

    return {
      variantId: item.variantId,
      productId: item.productId,
      productName: item.productName.trim(),
      variantName: item.variantName.trim(),
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice || (item.quantity * item.unitPrice)
    };
  }
}

// Table configuration
export const CART_TABLE = process.env.CART_TABLE || 'giftify-cart'; 