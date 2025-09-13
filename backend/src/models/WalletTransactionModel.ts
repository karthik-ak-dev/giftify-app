import { ulid } from 'ulid';

// Transaction type enum for type safety
export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  REFUND = 'REFUND'
}

// Transaction status enum for type safety
export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// WalletTransaction class - exact DynamoDB item structure with constructor and methods
export class WalletTransaction {
  readonly userId: string;           // Partition Key (immutable)
  readonly transactionId: string;    // Sort Key - ULID (immutable)
  readonly createdAt: string;        // ISO timestamp (immutable)
  
  type: TransactionType;
  amount: number;                    // In cents/paise
  balanceAfter: number;             // In cents/paise
  description: string;
  orderId?: string;                 // Optional - for order-related transactions
  status: TransactionStatus;
  updatedAt: string;                // ISO timestamp

  constructor(data: {
    userId: string;
    transactionId: string;
    type: TransactionType;
    amount: number;
    balanceAfter: number;
    description: string;
    orderId?: string;
    status?: TransactionStatus;
    createdAt?: string;
    updatedAt?: string;
  }) {
    // Validate required fields
    this.validateRequiredFields(data);
    
    // Immutable fields
    this.userId = data.userId;
    this.transactionId = data.transactionId;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    // Mutable fields
    this.type = data.type;
    this.amount = this.validateAmount(data.amount);
    this.balanceAfter = this.validateBalance(data.balanceAfter);
    this.description = this.validateDescription(data.description);
    this.orderId = data.orderId;
    this.status = data.status ?? TransactionStatus.PENDING;
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
  }

  // Create new transaction instance with validation
  static create(data: {
    userId: string;
    type: TransactionType;
    amount: number;
    balanceAfter: number;
    description: string;
    orderId?: string;
  }): WalletTransaction {
    return new WalletTransaction({
      transactionId: ulid(),
      ...data
    });
  }

  // Update transaction data with validation
  update(data: Partial<{
    status: TransactionStatus;
    description: string;
  }>): WalletTransaction {
    const updates: any = {};
    
    if (data.status !== undefined) {
      updates.status = data.status;
    }
    if (data.description !== undefined) {
      updates.description = this.validateDescription(data.description);
    }

    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Status operations
  markAsCompleted(): WalletTransaction {
    return this.update({ status: TransactionStatus.COMPLETED });
  }

  markAsFailed(): WalletTransaction {
    return this.update({ status: TransactionStatus.FAILED });
  }

  markAsPending(): WalletTransaction {
    return this.update({ status: TransactionStatus.PENDING });
  }

  // Computed properties
  get isCompleted(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }

  get isPending(): boolean {
    return this.status === TransactionStatus.PENDING;
  }

  get isFailed(): boolean {
    return this.status === TransactionStatus.FAILED;
  }

  get isCredit(): boolean {
    return this.type === TransactionType.CREDIT;
  }

  get isDebit(): boolean {
    return this.type === TransactionType.DEBIT;
  }

  get isRefund(): boolean {
    return this.type === TransactionType.REFUND;
  }

  // Get formatted amount for display
  get formattedAmount(): string {
    const amountInRupees = this.amount / 100;
    return `₹${amountInRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  // Get formatted balance for display
  get formattedBalanceAfter(): string {
    const balanceInRupees = this.balanceAfter / 100;
    return `₹${balanceInRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  // Private validation methods
  private validateRequiredFields(data: any): void {
    const required = ['userId', 'transactionId', 'type', 'amount', 'balanceAfter', 'description'];
    for (const field of required) {
      if (data[field] === undefined || data[field] === null) {
        throw new Error(`${field} is required`);
      }
    }
  }

  private validateAmount(amount: number): number {
    if (amount <= 0) {
      throw new Error('Transaction amount must be positive');
    }
    if (!Number.isInteger(amount)) {
      throw new Error('Transaction amount must be an integer (in paise)');
    }
    return amount;
  }

  private validateBalance(balance: number): number {
    if (balance < 0) {
      throw new Error('Balance cannot be negative');
    }
    if (!Number.isInteger(balance)) {
      throw new Error('Balance must be an integer (in paise)');
    }
    return balance;
  }

  private validateDescription(description: string): string {
    if (!description || description.trim().length === 0) {
      throw new Error('Description cannot be empty');
    }
    if (description.length > 255) {
      throw new Error('Description cannot exceed 255 characters');
    }
    return description.trim();
  }
}

// Table configuration
export const WALLET_TRANSACTION_TABLE = process.env.WALLET_TRANSACTIONS_TABLE || 'giftify-wallet-transactions';
export const TRANSACTION_ID_GSI = 'TransactionIdIndex';
export const USER_TRANSACTION_HISTORY_GSI = 'UserTransactionHistoryIndex'; 