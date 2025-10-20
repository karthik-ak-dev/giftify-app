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

export interface GetTransactionsOptions {
  page?: number;
  limit?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
}
