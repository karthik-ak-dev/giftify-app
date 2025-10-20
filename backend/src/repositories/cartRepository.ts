import { PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Cart, CART_TABLE } from '../models/CartModel';
import { docClient } from '../utils/database';

export class CartRepository {
  async create(cart: Cart): Promise<Cart> {
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

  async save(cart: Cart): Promise<Cart> {
    const command = new PutCommand({
      TableName: CART_TABLE,
      Item: cart
    });
    
    await docClient.send(command);
    return cart;
  }

  async delete(userId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: CART_TABLE,
      Key: { userId }
    });
    
    await docClient.send(command);
  }
}

export const cartRepository = new CartRepository();
