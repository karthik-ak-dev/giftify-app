import { TransactionType, TransactionStatus } from '../models/WalletTransactionModel';


// Enhanced response interfaces for services
export interface WalletTransactionResponse {
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

export interface WalletBalanceResponse {
  balance: number;
  balanceFormatted: string;
  balanceInRupees: number;
}

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

export interface GetTransactionsOptions {
  page?: number;
  limit?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
}

// Request interfaces
export interface TopupRequest {
  amount: number;
  description?: string;
} 