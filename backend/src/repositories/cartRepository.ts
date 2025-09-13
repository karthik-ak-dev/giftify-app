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

  async delete(userId: string): Promise<void> {
    await db.delete(CartModel.tableName, { userId });
  }
}

export const cartRepository = new CartRepository(); 