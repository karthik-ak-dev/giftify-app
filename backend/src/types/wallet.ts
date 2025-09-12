// Wallet types
export interface WalletTransaction {
  userId: string;
  transactionId: string;
  type: 'CREDIT' | 'DEBIT' | 'REFUND';
  amount: number;
  balanceAfter: number;
  description: string;
  orderId?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface WalletBalance {
  balance: number;
  balanceFormatted: string;
}

export interface TopupRequest {
  amount: number;
  description?: string;
} 