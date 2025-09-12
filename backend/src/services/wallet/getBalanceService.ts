import { userRepository } from '../../repositories/userRepository';
import { WalletBalance } from '../../types/wallet';
import { AppError } from '../../middleware/errorHandler';
import { formatCurrency } from '../../utils/currency';

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