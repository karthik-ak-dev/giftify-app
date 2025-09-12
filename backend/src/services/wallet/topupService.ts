import { walletTransactionRepository } from '../../repositories/walletTransactionRepository';
import { userRepository } from '../../repositories/userRepository';
import { AppError } from '../../middleware/errorHandler';
import { ulid } from 'ulid';

export const topupService = async (userId: string, amount: number, description?: string) => {
  // Validate amount
  if (amount <= 0) {
    throw new AppError('Amount must be greater than 0', 400, 'INVALID_AMOUNT');
  }

  // Get current user balance
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const transactionId = ulid();
  const now = new Date().toISOString();
  const newBalance = user.walletBalance + amount;

  try {
    // Create transaction record
    await walletTransactionRepository.create({
      userId,
      transactionId,
      type: 'CREDIT',
      amount,
      balanceAfter: newBalance,
      description: description || 'Manual wallet top-up',
      status: 'COMPLETED',
      createdAt: now,
      updatedAt: now
    });

    // Update user balance
    await userRepository.updateWalletBalance(userId, newBalance);

    return {
      transactionId,
      amount,
      newBalance,
      status: 'COMPLETED'
    };
  } catch (error) {
    // Mark transaction as failed if something goes wrong
    await walletTransactionRepository.updateStatus(transactionId, 'FAILED');
    throw new AppError('Failed to process wallet top-up', 500, 'TOPUP_FAILED');
  }
}; 