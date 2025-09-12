import { User } from '../types/user';

export class UserModel {
  static readonly tableName = process.env.USERS_TABLE || 'giftify-users';
  
  // Primary Key
  static readonly partitionKey = 'userId';
  
  // GSI Keys
  static readonly emailGSI = 'EmailIndex';
  static readonly emailGSIKey = 'email';
  
  // Table schema definition
  static readonly schema = {
    userId: 'string',           // ULID - Primary Key
    email: 'string',            // GSI1 Partition Key
    firstName: 'string',
    lastName: 'string',
    phoneNumber: 'string',      // Optional
    passwordHash: 'string',     // Not exposed in User interface
    isEmailVerified: 'boolean',
    isPhoneVerified: 'boolean',
    status: 'string',           // ACTIVE, SUSPENDED, DELETED
    walletBalance: 'number',    // In cents/paise
    createdAt: 'string',        // ISO timestamp
    updatedAt: 'string',        // ISO timestamp
    lastLoginAt: 'string'       // Optional - ISO timestamp
  };
  
  // Default values
  static readonly defaults = {
    isEmailVerified: false,
    isPhoneVerified: false,
    status: 'ACTIVE',
    walletBalance: 0
  };
  
  // Validation rules
  static readonly validation = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    firstName: {
      required: true,
      minLength: 1,
      maxLength: 50
    },
    lastName: {
      required: true,
      minLength: 1,
      maxLength: 50
    },
    phoneNumber: {
      pattern: /^\+?[1-9]\d{1,14}$/
    }
  };
  
  // Transform DB item to User interface (exclude sensitive fields)
  static toUser(item: any): User {
    return {
      userId: item.userId,
      email: item.email,
      firstName: item.firstName,
      lastName: item.lastName,
      phoneNumber: item.phoneNumber,
      isEmailVerified: item.isEmailVerified,
      isPhoneVerified: item.isPhoneVerified,
      status: item.status,
      walletBalance: item.walletBalance,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      lastLoginAt: item.lastLoginAt
    };
  }
} 