import { CartModel } from '../models/CartModel';
import { Cart } from '../types/cart';
import { db } from '../utils/database';

export class CartRepository {
  async findByUserId(userId: string): Promise<Cart | null> {
    const item = await db.get(CartModel.tableName, { userId });
    return item ? CartModel.toCart(item) : null;
  }

  async save(cart: Cart): Promise<Cart> {
    const item = await db.put(CartModel.tableName, cart);
    return CartModel.toCart(item);
  }

  async create(cartData: Cart): Promise<Cart> {
    const item = await db.put(CartModel.tableName, cartData);
    return CartModel.toCart(item);
  }

  async update(userId: string, updateData: any): Promise<Cart> {
    const updatedItem = await db.update(CartModel.tableName, { userId }, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    return CartModel.toCart(updatedItem);
  }

  async delete(userId: string): Promise<void> {
    await db.delete(CartModel.tableName, { userId });
  }

  async addItem(userId: string, item: any): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    
    if (!cart) {
      // Create new cart with item
      const newCart: Cart = {
        userId,
        items: [item],
        totalAmount: item.totalPrice,
        totalItems: item.quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return await this.create(newCart);
    }

    // Add item to existing cart
    const existingItemIndex = cart.items.findIndex(cartItem => cartItem.variantId === item.variantId);
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex] = item;
    } else {
      cart.items.push(item);
    }

    // Recalculate totals
    const totals = CartModel.calculateTotals(cart.items);
    cart.totalAmount = totals.totalAmount;
    cart.totalItems = totals.totalItems;
    cart.updatedAt = new Date().toISOString();

    return await this.save(cart);
  }

  async removeItem(userId: string, variantId: string): Promise<Cart | null> {
    const cart = await this.findByUserId(userId);
    
    if (!cart) {
      return null;
    }

    // Remove item
    cart.items = cart.items.filter(item => item.variantId !== variantId);

    // Recalculate totals
    const totals = CartModel.calculateTotals(cart.items);
    cart.totalAmount = totals.totalAmount;
    cart.totalItems = totals.totalItems;
    cart.updatedAt = new Date().toISOString();

    return await this.save(cart);
  }

  async clear(userId: string): Promise<void> {
    await this.delete(userId);
  }
}

export const cartRepository = new CartRepository(); 