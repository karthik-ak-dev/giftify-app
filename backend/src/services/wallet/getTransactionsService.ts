import { walletTransactionRepository } from '../../repositories/walletTransactionRepository';
import { PaginationParams, PaginatedResponse } from '../../types/api';
import { WalletTransaction } from '../../types/wallet';

const formatCurrency = (amountInCents: number): string => {
  const amount = amountInCents / 100;
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getTransactionsService = async (
  userId: string, 
  options: PaginationParams & { type?: string }
): Promise<PaginatedResponse<WalletTransaction & { amountFormatted: string; balanceAfterFormatted: string }>> => {
  const { page = 1, limit = 20, type } = options;

  const result = await walletTransactionRepository.findByUserId(
    userId, 
    { page, limit, type }
  );

  return {
    items: result.items.map(transaction => ({
      ...transaction,
      amountFormatted: formatCurrency(transaction.amount),
      balanceAfterFormatted: formatCurrency(transaction.balanceAfter)
    })),
    pagination: result.pagination
  };
}; 