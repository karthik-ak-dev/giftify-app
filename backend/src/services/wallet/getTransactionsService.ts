import { walletTransactionRepository } from '../../repositories/walletTransactionRepository';
import { userRepository } from '../../repositories/userRepository';
import { PaginationParams, PaginatedResponse } from '../../types/api';
import { WalletTransactionResponse, GetTransactionsOptions } from '../../types/wallet';
import { TransactionType, TransactionStatus } from '../../models/WalletTransactionModel';
import { AppError } from '../../middleware/errorHandler';

export const getTransactionsService = async (
  userId: string, 
  options: GetTransactionsOptions = {}
): Promise<PaginatedResponse<WalletTransactionResponse>> => {
  try {
    // Validate user exists and is active
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (!user.isActive) {
      throw new AppError('User account is inactive', 403, 'USER_INACTIVE');
    }

    const { 
      page = 1, 
      limit = 20, 
      type, 
      status,
      startDate,
      endDate 
    } = options;

    // Validate pagination parameters
    if (page < 1) {
      throw new AppError('Page number must be greater than 0', 400, 'INVALID_PAGE');
    }

    if (limit < 1 || limit > 100) {
      throw new AppError('Limit must be between 1 and 100', 400, 'INVALID_LIMIT');
    }

    // Validate type if provided
    if (type && !Object.values(TransactionType).includes(type)) {
      throw new AppError('Invalid transaction type', 400, 'INVALID_TRANSACTION_TYPE');
    }

    // Validate status if provided
    if (status && !Object.values(TransactionStatus).includes(status)) {
      throw new AppError('Invalid transaction status', 400, 'INVALID_TRANSACTION_STATUS');
    }

    // Get transactions based on filters
    let result;
    
    if (startDate && endDate) {
      // Validate date format
      if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
        throw new AppError('Invalid date format', 400, 'INVALID_DATE_FORMAT');
      }
      
      if (new Date(startDate) > new Date(endDate)) {
        throw new AppError('Start date cannot be after end date', 400, 'INVALID_DATE_RANGE');
      }
      
      const transactions = await walletTransactionRepository.findTransactionsByDateRange(
        userId, 
        startDate, 
        endDate
      );
      
      // Apply additional filters and pagination manually for date range queries
      let filteredTransactions = transactions;
      
      if (type) {
        filteredTransactions = filteredTransactions.filter(t => t.type === type);
      }
      
      if (status) {
        filteredTransactions = filteredTransactions.filter(t => t.status === status);
      }
      
      // Manual pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
      const totalPages = Math.ceil(filteredTransactions.length / limit);
      
      result = {
        items: paginatedTransactions,
        pagination: {
          page,
          limit,
          total: filteredTransactions.length,
          totalPages,
          hasNext: endIndex < filteredTransactions.length,
          hasPrev: page > 1
        }
      };
    } else {
      // Use repository pagination for regular queries
      const typeString = type ? type.toString() : undefined;
      result = await walletTransactionRepository.findByUserId(
        userId, 
        { page, limit, type: typeString }
      );
      
      // Filter by status if provided (repository doesn't support status filtering yet)
      if (status) {
        result.items = result.items.filter(t => t.status === status);
        result.pagination.total = result.items.length;
        result.pagination.totalPages = Math.ceil(result.items.length / limit);
      }
    }

    // Convert to enhanced response format with computed properties
    const enhancedItems: WalletTransactionResponse[] = result.items.map(transaction => ({
      userId: transaction.userId,
      transactionId: transaction.transactionId,
      type: transaction.type,
      amount: transaction.amount,
      balanceAfter: transaction.balanceAfter,
      description: transaction.description,
      orderId: transaction.orderId,
      status: transaction.status,
      isCompleted: transaction.isCompleted,
      isPending: transaction.isPending,
      isFailed: transaction.isFailed,
      isCredit: transaction.isCredit,
      isDebit: transaction.isDebit,
      isRefund: transaction.isRefund,
      formattedAmount: transaction.formattedAmount,
      formattedBalanceAfter: transaction.formattedBalanceAfter,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }));

    return {
      items: enhancedItems,
      pagination: result.pagination
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

    // Handle validation errors from models
    if (error instanceof Error && (
      error.message.includes('required') ||
      error.message.includes('Invalid') ||
      error.message.includes('must be')
    )) {
      throw new AppError(`Validation error: ${error.message}`, 400, 'VALIDATION_ERROR');
    }

    // Handle any other unexpected errors
    if (error instanceof Error) {
      throw new AppError(`Failed to get wallet transactions: ${error.message}`, 500, 'TRANSACTIONS_FETCH_FAILED');
    }

    throw new AppError('Failed to get wallet transactions', 500, 'TRANSACTIONS_FETCH_FAILED');
  }
}; 