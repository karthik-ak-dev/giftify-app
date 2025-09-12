import { userRepository } from '../../repositories/userRepository';
import { WalletBalance } from '../../types/wallet';
import { AppError } from '../../middleware/errorHandler';

const formatCurrency = (amountInCents: number): string => {
  const amount = amountInCents / 100;
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getBalanceService = async (userId: string): Promise<WalletBalance> => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return {
    balance: user.walletBalance,
    balanceFormatted: formatCurrency(user.walletBalance)
  };
}; 