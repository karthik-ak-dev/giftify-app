import { ulid } from 'ulid';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  REFUND = 'REFUND'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export class WalletTransaction {
  readonly userId: string;
  readonly transactionId: string;
  readonly createdAt: string;
  
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  orderId?: string;
  status: TransactionStatus;
  updatedAt: string;

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
    this.validateRequiredFields(data);
    
    this.userId = data.userId;
    this.transactionId = data.transactionId;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    this.type = data.type;
    this.amount = this.validateAmount(data.amount);
    this.balanceAfter = this.validateBalance(data.balanceAfter);
    this.description = this.validateDescription(data.description);
    this.orderId = data.orderId;
    this.status = data.status ?? TransactionStatus.PENDING;
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
  }

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

  markAsCompleted(): WalletTransaction {
    return this.update({ status: TransactionStatus.COMPLETED });
  }

  markAsFailed(): WalletTransaction {
    return this.update({ status: TransactionStatus.FAILED });
  }

  markAsPending(): WalletTransaction {
    return this.update({ status: TransactionStatus.PENDING });
  }

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

  get formattedAmount(): string {
    const amountInRupees = this.amount / 100;
    return `₹${amountInRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  get formattedBalanceAfter(): string {
    const balanceInRupees = this.balanceAfter / 100;
    return `₹${balanceInRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

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

export const WALLET_TRANSACTION_TABLE = process.env.WALLET_TRANSACTIONS_TABLE as string;
export const TRANSACTION_ID_GSI = 'TransactionIdIndex';
export const USER_TRANSACTION_HISTORY_GSI = 'UserTransactionHistoryIndex';
