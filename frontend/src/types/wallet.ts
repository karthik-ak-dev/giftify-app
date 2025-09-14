/**
 * Wallet Types
 * Based on backend WalletTransactionModel and wallet types
 */

// Transaction Type from backend
export enum TransactionType {
  TOPUP = 'TOPUP',
  ORDER_PAYMENT = 'ORDER_PAYMENT',
  REFUND = 'REFUND'
}

// Transaction Status from backend
export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Wallet Transaction Response from backend
export interface WalletTransaction {
  userId: string;
  transactionId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  orderId?: string;
  status: TransactionStatus;
  isCompleted: boolean;
  isPending: boolean;
  isFailed: boolean;
  isCredit: boolean;
  isDebit: boolean;
  isRefund: boolean;
  formattedAmount: string;
  formattedBalanceAfter: string;
  createdAt: string;
  updatedAt: string;
}

// Wallet Balance Response from backend
export interface WalletBalanceResponse {
  balance: number;
  balanceFormatted: string;
  balanceInRupees: number;
}

// Topup Request
export interface TopupRequest {
  amount: number;
}

// Topup Response from backend
export interface TopupResponse {
  transactionId: string;
  amount: number;
  amountFormatted: string;
  newBalance: number;
  newBalanceFormatted: string;
  status: TransactionStatus;
  description: string;
  createdAt: string;
}

// Transaction Filters
export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: TransactionType;
  status?: TransactionStatus;
} 