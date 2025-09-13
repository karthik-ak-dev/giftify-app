import { PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Cart, CartItem, CART_TABLE } from '../models/CartModel';
import { docClient } from '../utils/database';

export class CartRepository {
  async create(cart: Cart): Promise<Cart> {
    const command = new PutCommand({
      TableName: CART_TABLE,
      Item: cart,
      ConditionExpression: 'attribute_not_exists(userId)' // Prevent overwriting existing cart
    });
    
    try {
      await docClient.send(command);
      return cart;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Cart already exists for this user');
      }
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const command = new GetCommand({
      TableName: CART_TABLE,
      Key: { userId }
    });
    
    const result = await docClient.send(command);
    return result.Item ? new Cart(result.Item as any) : null;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const existingCart = await this.findByUserId(userId);
    if (existingCart) {
      return existingCart;
    }
    
    const newCart = Cart.create(userId);
    
    // Use PutCommand with condition to handle race conditions
    const command = new PutCommand({
      TableName: CART_TABLE,
      Item: newCart,
      ConditionExpression: 'attribute_not_exists(userId)'
    });
    
    try {
      await docClient.send(command);
      return newCart;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        // Cart was created by another request, fetch it
        const cart = await this.findByUserId(userId);
        if (cart) return cart;
        throw new Error('Failed to create or retrieve cart');
      }
      throw error;
    }
  }

  async save(cart: Cart): Promise<Cart> {
    const command = new PutCommand({
      TableName: CART_TABLE,
      Item: cart
    });
    
    await docClient.send(command);
    return cart;
  }

  async addItem(userId: string, item: Omit<CartItem, 'totalPrice'>): Promise<Cart> {
    const cart = await this.findOrCreateByUserId(userId);
    cart.addItem(item);
    return await this.save(cart);
  }

  async updateItemQuantity(userId: string, variantId: string, quantity: number): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    cart.updateItemQuantity(variantId, quantity);
    return await this.save(cart);
  }

  async removeItem(userId: string, variantId: string): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    cart.removeItem(variantId);
    return await this.save(cart);
  }

  async clear(userId: string): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    if (!cart) {
      // Return empty cart if none exists
      return Cart.create(userId);
    }
    
    cart.clear();
    return await this.save(cart);
  }

  async delete(userId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: CART_TABLE,
      Key: { userId }
    });
    
    await docClient.send(command);
  }

  // Atomic operations for better performance and consistency
  async atomicAddItem(userId: string, item: Omit<CartItem, 'totalPrice'>): Promise<Cart> {
    // First, try to get existing cart
    let cart = await this.findByUserId(userId);
    
    if (!cart) {
      // Create new cart with the item
      cart = Cart.create(userId);
      cart.addItem(item);
      
      const command = new PutCommand({
        TableName: CART_TABLE,
        Item: cart,
        ConditionExpression: 'attribute_not_exists(userId)'
      });
      
      try {
        await docClient.send(command);
        return cart;
      } catch (error: any) {
        if (error.name === 'ConditionalCheckFailedException') {
          // Cart was created concurrently, fall back to regular add
          return await this.addItem(userId, item);
        }
        throw error;
      }
    } else {
      // Add item to existing cart
      cart.addItem(item);
      return await this.save(cart);
    }
  }

  async atomicUpdateQuantity(userId: string, variantId: string, quantity: number): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    if (quantity <= 0) {
      cart.removeItem(variantId);
    } else {
      cart.updateItemQuantity(variantId, quantity);
    }
    
    return await this.save(cart);
  }

  // Business methods with optimized queries
  async getCartSummary(userId: string): Promise<{
    itemCount: number;
    totalItems: number;
    totalAmount: number;
    formattedTotalAmount: string;
  } | null> {
    const cart = await this.findByUserId(userId);
    return cart ? cart.getSummary() : null;
  }

  async hasItems(userId: string): Promise<boolean> {
    const cart = await this.findByUserId(userId);
    return cart ? !cart.isEmpty : false;
  }

  async getItemCount(userId: string): Promise<number> {
    const cart = await this.findByUserId(userId);
    return cart ? cart.itemCount : 0;
  }

  async hasItem(userId: string, variantId: string): Promise<boolean> {
    const cart = await this.findByUserId(userId);
    return cart ? cart.hasItem(variantId) : false;
  }

  async getItem(userId: string, variantId: string): Promise<CartItem | null> {
    const cart = await this.findByUserId(userId);
    return cart ? cart.getItem(variantId) || null : null;
  }

  // Batch operations for better performance
  async batchUpdateItems(userId: string, updates: Array<{
    variantId: string;
    quantity: number;
  }>): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    // Apply all updates
    for (const update of updates) {
      if (update.quantity <= 0) {
        cart.removeItem(update.variantId);
      } else {
        cart.updateItemQuantity(update.variantId, update.quantity);
      }
    }
    
    return await this.save(cart);
  }

  // Validation methods
  async validateCartExists(userId: string): Promise<void> {
    const cart = await this.findByUserId(userId);
    if (!cart) {
      throw new Error(`Cart not found for user: ${userId}`);
    }
  }

  async validateItemExists(userId: string, variantId: string): Promise<void> {
    const hasItem = await this.hasItem(userId, variantId);
    if (!hasItem) {
      throw new Error(`Item ${variantId} not found in cart for user: ${userId}`);
    }
  }
}

export const cartRepository = new CartRepository(); 