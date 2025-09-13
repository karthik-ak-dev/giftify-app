import { UserModel } from '../models/UserModel';
import { User } from '../types/user';
import { db } from '../utils/database';

export class UserRepository {
  async create(userData: any): Promise<User> {
    const item = await db.put(UserModel.tableName, userData);
    return UserModel.toUser(item);
  }

  async findById(userId: string): Promise<any | null> {
    const item = await db.get(UserModel.tableName, { userId });
    return item ? item : null;
  }

  async findByEmail(email: string): Promise<any | null> {
    const items = await db.queryGSI(
      UserModel.tableName,
      UserModel.emailGSI,
      UserModel.emailGSIKey,
      email
    );
    return items.length > 0 ? items[0] : null;
  }

  async updateWalletBalance(userId: string, newBalance: number): Promise<void> {
    await db.update(UserModel.tableName, { userId }, {
      walletBalance: newBalance,
      updatedAt: new Date().toISOString()
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await db.update(UserModel.tableName, { userId }, {
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  async update(userId: string, updateData: any): Promise<User> {
    const updatedItem = await db.update(UserModel.tableName, { userId }, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    return UserModel.toUser(updatedItem);
  }


}

export const userRepository = new UserRepository(); 