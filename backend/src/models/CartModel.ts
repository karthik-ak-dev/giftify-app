import { Cart } from '../types/cart';

export class CartModel {
  static readonly tableName = process.env.CART_TABLE || 'giftify-cart';
  
  // Primary Key
  static readonly partitionKey = 'userId';
  
  // Table schema definition
  static readonly schema = {
    userId: 'string',           // Primary Key
    items: 'list',              // Array of cart items
    totalAmount: 'number',      // Sum of all item totalPrices in cents/paise
    totalItems: 'number',       // Sum of all quantities
    createdAt: 'string',        // ISO timestamp
    updatedAt: 'string'         // ISO timestamp
  };
  
  // Cart item schema
  static readonly itemSchema = {
    variantId: 'string',
    productId: 'string',
    productName: 'string',
    variantName: 'string',
    quantity: 'number',
    unitPrice: 'number',        // In cents/paise
    totalPrice: 'number'        // In cents/paise
  };
  
  // Default values
  static readonly defaults = {
    items: [],
    totalAmount: 0,
    totalItems: 0
  };
  
  // Validation rules
  static readonly validation = {
    items: {
      type: 'array',
      items: {
        variantId: { required: true },
        productId: { required: true },
        productName: { required: true },
        variantName: { required: true },
        quantity: { required: true, min: 1 },
        unitPrice: { required: true, min: 1 },
        totalPrice: { required: true, min: 1 }
      }
    }
  };
  
  // Transform DB item to Cart interface
  static toCart(item: any): Cart {
    return {
      userId: item.userId,
      items: item.items || [],
      totalAmount: item.totalAmount || 0,
      totalItems: item.totalItems || 0,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }
  
  // Calculate cart totals
  static calculateTotals(items: any[]): { totalAmount: number; totalItems: number } {
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    return { totalAmount, totalItems };
  }
} 