import { Cart, CartItem, CART_TABLE } from '../models/CartModel';
import { db } from '../utils/database';

export class CartRepository {
  async create(cart: Cart): Promise<Cart> {
    await db.put(CART_TABLE, cart);
    return cart;
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const item = await db.get(CART_TABLE, { userId });
    return item ? new Cart(item as any) : null;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const existingCart = await this.findByUserId(userId);
    if (existingCart) {
      return existingCart;
    }
    
    const newCart = Cart.create(userId);
    await this.create(newCart);
    return newCart;
  }

  async save(cart: Cart): Promise<Cart> {
    await db.put(CART_TABLE, cart);
    return cart;
  }

  async addItem(userId: string, item: Omit<CartItem, 'totalPrice'>): Promise<Cart> {
    const cart = await this.findOrCreateByUserId(userId);
    cart.addItem(item);
    await this.save(cart);
    return cart;
  }

  async updateItemQuantity(userId: string, variantId: string, quantity: number): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    cart.updateItemQuantity(variantId, quantity);
    await this.save(cart);
    return cart;
  }

  async removeItem(userId: string, variantId: string): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    cart.removeItem(variantId);
    await this.save(cart);
    return cart;
  }

  async clear(userId: string): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    if (!cart) {
      // Return empty cart if none exists
      return Cart.create(userId);
    }
    
    cart.clear();
    await this.save(cart);
    return cart;
  }

  async delete(userId: string): Promise<void> {
    await db.delete(CART_TABLE, { userId });
  }

  // Business methods
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
}

export const cartRepository = new CartRepository(); 