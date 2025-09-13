import { WalletTransactionModel } from '../models/WalletTransactionModel';
import { WalletTransaction } from '../types/wallet';
import { PaginationParams, PaginatedResponse } from '../types/api';
import { db } from '../utils/database';

export class WalletTransactionRepository {
  async create(transactionData: any): Promise<WalletTransaction> {
    const item = await db.put(WalletTransactionModel.tableName, transactionData);
    return WalletTransactionModel.toWalletTransaction(item);
  }

  async findById(transactionId: string): Promise<WalletTransaction | null> {
    const items = await db.queryGSI(
      WalletTransactionModel.tableName,
      WalletTransactionModel.transactionIdGSI,
      WalletTransactionModel.transactionIdGSIKey,
      transactionId
    );
    return items.length > 0 ? WalletTransactionModel.toWalletTransaction(items[0]) : null;
  }

  async findByUserId(
    userId: string,
    options: PaginationParams & { type?: string }
  ): Promise<PaginatedResponse<WalletTransaction>> {
    const { page = 1, limit = 20, type } = options;
    
    let items: any[];
    
    if (type) {
      // Filter by transaction type - this would require a more complex query
      // For now, get all transactions and filter in memory (not ideal for production)
      const allItems = await db.queryGSI(
        WalletTransactionModel.tableName,
        WalletTransactionModel.userTransactionHistoryGSI,
        WalletTransactionModel.userTransactionHistoryGSIPartitionKey,
        userId
      );
      items = allItems.filter(item => item.type === type);
    } else {
      items = await db.queryGSI(
        WalletTransactionModel.tableName,
        WalletTransactionModel.userTransactionHistoryGSI,
        WalletTransactionModel.userTransactionHistoryGSIPartitionKey,
        userId
      );
    }

    // Sort by createdAt descending
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    const totalPages = Math.ceil(items.length / limit);
    
    return {
      items: paginatedItems.map(item => WalletTransactionModel.toWalletTransaction(item)),
      pagination: {
        page,
        limit,
        total: items.length,
        totalPages,
        hasNext: endIndex < items.length,
        hasPrev: page > 1
      }
    };
  }

  async updateStatus(transactionId: string, status: string): Promise<void> {
    // First find the transaction to get userId
    const transaction = await this.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    await db.update(
      WalletTransactionModel.tableName,
      { userId: transaction.userId, transactionId },
      {
        status,
        updatedAt: new Date().toISOString()
      }
    );
  }


}

export const walletTransactionRepository = new WalletTransactionRepository(); 