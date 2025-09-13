import { WalletTransaction, WALLET_TRANSACTION_TABLE, TRANSACTION_ID_GSI, USER_TRANSACTION_HISTORY_GSI } from '../models/WalletTransactionModel';
import { PaginationParams, PaginatedResponse } from '../types/api';
import { db } from '../utils/database';

export class WalletTransactionRepository {
  async create(transaction: WalletTransaction): Promise<WalletTransaction> {
    await db.put(WALLET_TRANSACTION_TABLE, transaction);
    return transaction;
  }

  async findById(transactionId: string): Promise<WalletTransaction | null> {
    const items = await db.queryGSI(WALLET_TRANSACTION_TABLE, TRANSACTION_ID_GSI, 'transactionId', transactionId);
    return items.length > 0 ? new WalletTransaction(items[0] as any) : null;
  }

  async findByUserId(
    userId: string,
    options: PaginationParams & { type?: string }
  ): Promise<PaginatedResponse<WalletTransaction>> {
    const { page = 1, limit = 20, type } = options;
    
    // Get all transactions for user
    const items = await db.queryGSI(WALLET_TRANSACTION_TABLE, USER_TRANSACTION_HISTORY_GSI, 'userId', userId);
    
    let filteredItems = items;
    
    // Filter by transaction type if specified
    if (type) {
      filteredItems = items.filter(item => item.type === type);
    }

    // Sort by createdAt descending
    filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredItems.length / limit);
    
    return {
      items: paginatedItems.map(item => new WalletTransaction(item as any)),
      pagination: {
        page,
        limit,
        total: filteredItems.length,
        totalPages,
        hasNext: endIndex < filteredItems.length,
        hasPrev: page > 1
      }
    };
  }

  async save(transaction: WalletTransaction): Promise<WalletTransaction> {
    transaction.update({}); // This updates the updatedAt timestamp
    await db.put(WALLET_TRANSACTION_TABLE, transaction);
    return transaction;
  }

  async updateStatus(transaction: WalletTransaction, status: 'COMPLETED' | 'FAILED' | 'PENDING'): Promise<WalletTransaction> {
    switch (status) {
      case 'COMPLETED':
        transaction.markAsCompleted();
        break;
      case 'FAILED':
        transaction.markAsFailed();
        break;
      case 'PENDING':
        transaction.markAsPending();
        break;
    }
    
    await db.update(WALLET_TRANSACTION_TABLE, 
      { userId: transaction.userId, transactionId: transaction.transactionId }, 
      {
        status: transaction.status,
        updatedAt: transaction.updatedAt
      }
    );
    return transaction;
  }

  async findByOrderId(orderId: string): Promise<WalletTransaction[]> {
    // Scan for transactions with specific orderId
    const items = await db.scan(WALLET_TRANSACTION_TABLE, {
      FilterExpression: 'orderId = :orderId',
      ExpressionAttributeValues: {
        ':orderId': orderId
      }
    });
    return items.map(item => new WalletTransaction(item as any));
  }

  async findCompletedByUserId(userId: string): Promise<WalletTransaction[]> {
    const items = await db.queryGSI(WALLET_TRANSACTION_TABLE, USER_TRANSACTION_HISTORY_GSI, 'userId', userId);
    const completedTransactions = items.filter(item => item.status === 'COMPLETED');
    return completedTransactions.map(item => new WalletTransaction(item as any));
  }

  async delete(transaction: WalletTransaction): Promise<void> {
    await db.delete(WALLET_TRANSACTION_TABLE, { 
      userId: transaction.userId, 
      transactionId: transaction.transactionId 
    });
  }
}

export const walletTransactionRepository = new WalletTransactionRepository(); 