import { walletTransactionRepository } from '../../repositories/walletTransactionRepository';
import { userRepository } from '../../repositories/userRepository';
import { WalletTransaction, TransactionType, TransactionStatus } from '../../models/WalletTransactionModel';
import { TopupResponse } from '../../types/wallet';
import { AppError } from '../../middleware/errorHandler';
import { formatCurrency } from '../../utils/currency';

export const topupService = async (
  userId: string, 
  amount: number, 
  description?: string
): Promise<TopupResponse> => {
  try {
    // Validate amount
    if (!amount || amount <= 0) {
      throw new AppError('Amount must be greater than 0', 400, 'INVALID_AMOUNT');
    }

    // Validate amount is not too large (prevent overflow)
    if (amount > 1000000 * 100) { // 10 lakh rupees in paise
      throw new AppError('Amount cannot exceed ₹10,00,000', 400, 'AMOUNT_TOO_LARGE');
    }

    // Validate amount is an integer (in paise)
    if (!Number.isInteger(amount)) {
      throw new AppError('Amount must be an integer (in paise)', 400, 'INVALID_AMOUNT_FORMAT');
    }

    // Get current user
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('User account is inactive', 403, 'USER_INACTIVE');
    }

    // Calculate new balance
    const newBalance = user.walletBalance + amount;

    // Validate new balance doesn't exceed maximum allowed
    const maxWalletBalance = 1000000 * 100; // 10 lakh rupees in paise
    if (newBalance > maxWalletBalance) {
      throw new AppError('Wallet balance cannot exceed ₹10,00,000', 400, 'WALLET_LIMIT_EXCEEDED');
    }

    // Create transaction using WalletTransaction model
    const transaction = WalletTransaction.create({
      userId,
      type: TransactionType.CREDIT,
      amount,
      balanceAfter: newBalance,
      description: description || 'Manual wallet top-up'
    });

    // Mark transaction as completed immediately for manual top-ups
    transaction.markAsCompleted();

    try {
      // Create transaction record first
      const createdTransaction = await walletTransactionRepository.create(transaction);

      // Update user balance using atomic operation
      const updatedUser = await userRepository.atomicWalletOperation(userId, amount, 'ADD');

      // Prepare response
      const response: TopupResponse = {
        transactionId: createdTransaction.transactionId,
        amount: createdTransaction.amount,
        amountFormatted: createdTransaction.formattedAmount,
        newBalance: updatedUser.walletBalance,
        newBalanceFormatted: formatCurrency(updatedUser.walletBalance),
        status: createdTransaction.status,
        description: createdTransaction.description,
        createdAt: createdTransaction.createdAt
      };

      return response;

    } catch (dbError) {
      // If database operations fail, mark transaction as failed
      try {
        transaction.markAsFailed();
        await walletTransactionRepository.updateStatus(transaction, TransactionStatus.FAILED);
      } catch (updateError) {
        // Log the error but don't throw - we want to throw the original error
        console.error('Failed to mark transaction as failed:', updateError);
      }

      // Handle specific database errors
      if (dbError instanceof Error) {
        if (dbError.message.includes('already exists')) {
          throw new AppError('Duplicate transaction detected', 409, 'DUPLICATE_TRANSACTION');
        }
        if (dbError.message.includes('Insufficient wallet balance')) {
          throw new AppError('Insufficient wallet balance', 400, 'INSUFFICIENT_BALANCE');
        }
        if (dbError.message.includes('User not found')) {
          throw new AppError('User not found', 404, 'USER_NOT_FOUND');
        }
      }

      throw new AppError('Failed to process wallet top-up', 500, 'TOPUP_FAILED');
    }

  } catch (error) {
    // Re-throw AppErrors
    if (error instanceof AppError) {
      throw error;
    }

    // Handle WalletTransaction model validation errors
    if (error instanceof Error && (
      error.message.includes('required') ||
      error.message.includes('must be positive') ||
      error.message.includes('must be an integer') ||
      error.message.includes('cannot be empty')
    )) {
      throw new AppError(`Transaction validation error: ${error.message}`, 400, 'TRANSACTION_VALIDATION_ERROR');
    }

    // Handle User model validation errors
    if (error instanceof Error && (
      error.message.includes('Wallet balance cannot be negative') ||
      error.message.includes('must be an integer')
    )) {
      throw new AppError(`User validation error: ${error.message}`, 400, 'USER_VALIDATION_ERROR');
    }

    // Handle any other unexpected errors
    if (error instanceof Error) {
      throw new AppError(`Failed to process wallet top-up: ${error.message}`, 500, 'TOPUP_FAILED');
    }

    throw new AppError('Failed to process wallet top-up', 500, 'TOPUP_FAILED');
  }
}; 