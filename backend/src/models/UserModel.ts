import { ulid } from 'ulid';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

export class User {
  readonly userId: string;
  readonly email: string;
  readonly createdAt: string;
  
  firstName: string;
  lastName: string;
  passwordHash: string;
  isEmailVerified: boolean;
  status: UserStatus;
  walletBalance: number;
  updatedAt: string;
  lastLoginAt?: string;

  constructor(data: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    isEmailVerified?: boolean;
    status?: UserStatus;
    walletBalance?: number;
    createdAt?: string;
    updatedAt?: string;
    lastLoginAt?: string;
  }) {
    this.validateRequiredFields(data);
    
    this.userId = data.userId;
    this.email = this.validateEmail(data.email);
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    this.firstName = this.validateName(data.firstName, 'firstName');
    this.lastName = this.validateName(data.lastName, 'lastName');
    this.passwordHash = data.passwordHash;
    this.isEmailVerified = data.isEmailVerified ?? false;
    this.status = data.status ?? UserStatus.ACTIVE;
    this.walletBalance = this.validateWalletBalance(data.walletBalance ?? 0);
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
    this.lastLoginAt = data.lastLoginAt;
  }

  static create(data: {
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
  }): User {
    return new User({
      userId: ulid(),
      ...data
    });
  }

  update(data: Partial<{
    firstName: string;
    lastName: string;
    passwordHash: string;
    isEmailVerified: boolean;
    status: UserStatus;
    walletBalance: number;
    lastLoginAt: string;
  }>): User {
    const updates: any = {};
    
    if (data.firstName !== undefined) {
      updates.firstName = this.validateName(data.firstName, 'firstName');
    }
    if (data.lastName !== undefined) {
      updates.lastName = this.validateName(data.lastName, 'lastName');
    }
    if (data.passwordHash !== undefined) {
      updates.passwordHash = data.passwordHash;
    }
    if (data.isEmailVerified !== undefined) {
      updates.isEmailVerified = data.isEmailVerified;
    }
    if (data.status !== undefined) {
      updates.status = data.status;
    }
    if (data.walletBalance !== undefined) {
      updates.walletBalance = this.validateWalletBalance(data.walletBalance);
    }
    if (data.lastLoginAt !== undefined) {
      updates.lastLoginAt = data.lastLoginAt;
    }

    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  toPublic() {
    const { passwordHash, ...publicData } = this;
    return publicData;
  }

  private validateRequiredFields(data: any): void {
    const required = ['userId', 'email', 'firstName', 'lastName', 'passwordHash'];
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`${field} is required`);
      }
    }
  }

  private validateEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    return email.toLowerCase();
  }

  private validateName(name: string, fieldName: string): string {
    if (!name || name.trim().length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }
    if (name.length > 50) {
      throw new Error(`${fieldName} cannot exceed 50 characters`);
    }
    return name.trim();
  }

  private validateWalletBalance(balance: number): number {
    if (balance < 0) {
      throw new Error('Wallet balance cannot be negative');
    }
    if (!Number.isInteger(balance)) {
      throw new Error('Wallet balance must be an integer (in paise)');
    }
    return balance;
  }
}

export const USER_TABLE = process.env.USERS_TABLE as string;
export const USER_EMAIL_GSI = 'EmailIndex';
