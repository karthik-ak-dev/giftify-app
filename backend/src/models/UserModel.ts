import { ulid } from 'ulid';

// User status enum for type safety
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

// User class - exact DynamoDB item structure with constructor and methods
export class User {
  readonly userId: string;           // ULID - Primary Key (immutable)
  readonly email: string;            // GSI1 Partition Key (immutable)
  readonly createdAt: string;        // ISO timestamp (immutable)
  
  firstName: string;
  lastName: string;
  passwordHash: string;              // Stored in DB but filtered out in API responses
  isEmailVerified: boolean;
  status: UserStatus;
  walletBalance: number;             // In cents/paise
  updatedAt: string;                 // ISO timestamp
  lastLoginAt?: string;              // Optional - ISO timestamp

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
    // Validate required fields
    this.validateRequiredFields(data);
    
    // Immutable fields
    this.userId = data.userId;
    this.email = this.validateEmail(data.email);
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    // Mutable fields
    this.firstName = this.validateName(data.firstName, 'firstName');
    this.lastName = this.validateName(data.lastName, 'lastName');
    this.passwordHash = data.passwordHash;
    this.isEmailVerified = data.isEmailVerified ?? false;
    this.status = data.status ?? UserStatus.ACTIVE;
    this.walletBalance = this.validateWalletBalance(data.walletBalance ?? 0);
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
    this.lastLoginAt = data.lastLoginAt;
  }

  // Create new user instance with validation
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

  // Update user data with validation
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

  // Wallet operations
  addToWallet(amount: number): User {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    return this.update({ walletBalance: this.walletBalance + amount });
  }

  deductFromWallet(amount: number): User {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (this.walletBalance < amount) {
      throw new Error('Insufficient wallet balance');
    }
    return this.update({ walletBalance: this.walletBalance - amount });
  }

  // Status operations
  activate(): User {
    return this.update({ status: UserStatus.ACTIVE });
  }

  suspend(): User {
    return this.update({ status: UserStatus.SUSPENDED });
  }

  markAsDeleted(): User {
    return this.update({ status: UserStatus.DELETED });
  }

  // Verification operations
  verifyEmail(): User {
    return this.update({ isEmailVerified: true });
  }

  // Update last login
  updateLastLogin(): User {
    return this.update({ lastLoginAt: new Date().toISOString() });
  }

  // Get user data without sensitive fields for API responses
  toPublic() {
    const { passwordHash, ...publicData } = this;
    return publicData;
  }

  // Get full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Check if user is active
  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  // Check if user has sufficient balance
  hasSufficientBalance(amount: number): boolean {
    return this.walletBalance >= amount;
  }

  // Private validation methods
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

// Table configuration
export const USER_TABLE = process.env.USERS_TABLE || 'giftify-users';
export const USER_EMAIL_GSI = 'EmailIndex'; 