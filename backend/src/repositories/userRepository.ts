import { User, USER_TABLE, USER_EMAIL_GSI } from '../models/UserModel';
import { db } from '../utils/database';

export class UserRepository {
  async create(user: User): Promise<User> {
    await db.put(USER_TABLE, user);
    return user;
  }

  async findById(userId: string): Promise<User | null> {
    const item = await db.get(USER_TABLE, { userId });
    return item ? new User(item as any) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const items = await db.queryGSI(USER_TABLE, USER_EMAIL_GSI, 'email', email);
    return items.length > 0 ? new User(items[0] as any) : null;
  }

  async save(user: User): Promise<User> {
    user.update({}); // This updates the updatedAt timestamp
    await db.put(USER_TABLE, user);
    return user;
  }

  async updateWalletBalance(user: User, newBalance: number): Promise<User> {
    user.update({ walletBalance: newBalance });
    await db.update(USER_TABLE, { userId: user.userId }, {
      walletBalance: user.walletBalance,
      updatedAt: user.updatedAt
    });
    return user;
  }

  async updateLastLogin(user: User): Promise<User> {
    user.update({ lastLoginAt: new Date().toISOString() });
    await db.update(USER_TABLE, { userId: user.userId }, {
      lastLoginAt: user.lastLoginAt,
      updatedAt: user.updatedAt
    });
    return user;
  }

  async delete(user: User): Promise<void> {
    await db.delete(USER_TABLE, { userId: user.userId });
  }
}

export const userRepository = new UserRepository(); 