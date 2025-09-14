export interface WalletTransaction {
  transactionId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  orderId?: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'CREDIT' | 'DEBIT' | 'REFUND';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface WalletBalance {
  balance: number;
  balanceFormatted: string;
}

export interface TopupRequest {
  amount: number;
  description?: string;
}

export interface TopupResponse {
  transactionId: string;
  amount: number;
  newBalance: number;
  status: TransactionStatus;
}

export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

export interface WalletActions {
  fetchBalance: () => Promise<void>;
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  topupWallet: (request: TopupRequest) => Promise<void>;
  clearError: () => void;
} 