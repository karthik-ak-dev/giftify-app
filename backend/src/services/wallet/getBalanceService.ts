import { userRepository } from '../../repositories/userRepository';
import { WalletBalanceResponse } from '../../types/wallet';
import { AppError } from '../../middleware/errorHandler';
import { formatCurrency } from '../../utils/currency';

export const getBalanceService = async (userId: string): Promise<WalletBalanceResponse> => {
  try {
    // Find user by ID
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('User account is inactive', 403, 'USER_INACTIVE');
    }

    // Return enhanced balance information (JSON serializable)
    return {
      balance: user.walletBalance,
      balanceFormatted: formatCurrency(user.walletBalance),
      balanceInRupees: user.walletBalance / 100
    };
  } catch (error) {
    // Re-throw AppErrors
    if (error instanceof AppError) {
      throw error;
    }

    // Handle repository errors
    if (error instanceof Error && error.message.includes('not found')) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Handle any other unexpected errors
    if (error instanceof Error) {
      throw new AppError(`Failed to get wallet balance: ${error.message}`, 500, 'BALANCE_FETCH_FAILED');
    }

    throw new AppError('Failed to get wallet balance', 500, 'BALANCE_FETCH_FAILED');
  }
}; 