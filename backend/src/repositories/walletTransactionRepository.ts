import { PutCommand, GetCommand, DeleteCommand, ScanCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { WalletTransaction, TransactionStatus, WALLET_TRANSACTION_TABLE, TRANSACTION_ID_GSI, USER_TRANSACTION_HISTORY_GSI } from '../models/WalletTransactionModel';
import { PaginationParams, PaginatedResponse } from '../types/api';
import { docClient } from '../utils/database';

export class WalletTransactionRepository {
  async create(transaction: WalletTransaction): Promise<WalletTransaction> {
    const command = new PutCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      Item: transaction,
      ConditionExpression: 'attribute_not_exists(userId) AND attribute_not_exists(transactionId)' // Prevent duplicate transactions
    });
    
    try {
      await docClient.send(command);
      return transaction;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Transaction already exists');
      }
      throw error;
    }
  }

  async findById(transactionId: string): Promise<WalletTransaction | null> {
    const command = new QueryCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      IndexName: TRANSACTION_ID_GSI,
      KeyConditionExpression: 'transactionId = :transactionId',
      ExpressionAttributeValues: {
        ':transactionId': transactionId
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items && result.Items.length > 0) ? new WalletTransaction(result.Items[0] as any) : null;
  }

  async findByUserId(
    userId: string,
    options: PaginationParams & { type?: string }
  ): Promise<PaginatedResponse<WalletTransaction>> {
    const { page = 1, limit = 20, type } = options;
    
    // Build query command
    const command = new QueryCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      IndexName: USER_TRANSACTION_HISTORY_GSI,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false // Sort by createdAt descending (most recent first)
    });
    
    // Add type filter if specified
    if (type) {
      command.input.FilterExpression = '#type = :type';
      command.input.ExpressionAttributeNames = { '#type': 'type' };
      command.input.ExpressionAttributeValues![':type'] = type;
    }
    
    const result = await docClient.send(command);
    let items = result.Items || [];
    
    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    const totalPages = Math.ceil(items.length / limit);
    
    return {
      items: paginatedItems.map(item => new WalletTransaction(item as any)),
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

  async save(transaction: WalletTransaction): Promise<WalletTransaction> {
    transaction.update({}); // This updates the updatedAt timestamp
    
    const command = new PutCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      Item: transaction
    });
    
    await docClient.send(command);
    return transaction;
  }

  async updateStatus(transaction: WalletTransaction, status: TransactionStatus): Promise<WalletTransaction> {
    switch (status) {
      case TransactionStatus.COMPLETED:
        transaction.markAsCompleted();
        break;
      case TransactionStatus.FAILED:
        transaction.markAsFailed();
        break;
      case TransactionStatus.PENDING:
        transaction.markAsPending();
        break;
    }
    
    const command = new UpdateCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      Key: { 
        userId: transaction.userId, 
        transactionId: transaction.transactionId 
      },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': transaction.status,
        ':updatedAt': transaction.updatedAt
      },
      ConditionExpression: 'attribute_exists(userId) AND attribute_exists(transactionId)' // Ensure transaction exists
    });
    
    try {
      await docClient.send(command);
      return transaction;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Transaction not found');
      }
      throw error;
    }
  }

  async findByOrderId(orderId: string): Promise<WalletTransaction[]> {
    const command = new ScanCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      FilterExpression: 'orderId = :orderId',
      ExpressionAttributeValues: {
        ':orderId': orderId
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new WalletTransaction(item as any));
  }

  async findCompletedByUserId(userId: string): Promise<WalletTransaction[]> {
    const command = new QueryCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      IndexName: USER_TRANSACTION_HISTORY_GSI,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':status': TransactionStatus.COMPLETED
      },
      ScanIndexForward: false // Most recent first
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new WalletTransaction(item as any));
  }

  // Advanced query methods
  async findTransactionsByDateRange(userId: string, startDate: string, endDate: string): Promise<WalletTransaction[]> {
    const command = new QueryCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      IndexName: USER_TRANSACTION_HISTORY_GSI,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'createdAt BETWEEN :startDate AND :endDate',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':startDate': startDate,
        ':endDate': endDate
      },
      ScanIndexForward: false
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new WalletTransaction(item as any));
  }

  async findTransactionsByAmountRange(userId: string, minAmount: number, maxAmount: number): Promise<WalletTransaction[]> {
    const command = new QueryCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      IndexName: USER_TRANSACTION_HISTORY_GSI,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'amount BETWEEN :minAmount AND :maxAmount',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':minAmount': minAmount,
        ':maxAmount': maxAmount
      },
      ScanIndexForward: false
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new WalletTransaction(item as any));
  }

  async getUserTransactionStats(userId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    failed: number;
    totalCredits: number;
    totalDebits: number;
    totalRefunds: number;
    netBalance: number;
  }> {
    const command = new QueryCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      IndexName: USER_TRANSACTION_HISTORY_GSI,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    });
    
    const result = await docClient.send(command);
    const transactions = (result.Items || []).map(item => new WalletTransaction(item as any));
    
    const stats = {
      total: transactions.length,
      completed: 0,
      pending: 0,
      failed: 0,
      totalCredits: 0,
      totalDebits: 0,
      totalRefunds: 0,
      netBalance: 0
    };
    
    transactions.forEach(transaction => {
      // Count by status
      if (transaction.isCompleted) {
        stats.completed++;
      } else if (transaction.isPending) {
        stats.pending++;
      } else if (transaction.isFailed) {
        stats.failed++;
      }
      
      // Sum by type (only completed transactions)
      if (transaction.isCompleted) {
        if (transaction.isCredit) {
          stats.totalCredits += transaction.amount;
          stats.netBalance += transaction.amount;
        } else if (transaction.isDebit) {
          stats.totalDebits += transaction.amount;
          stats.netBalance -= transaction.amount;
        } else if (transaction.isRefund) {
          stats.totalRefunds += transaction.amount;
          stats.netBalance += transaction.amount;
        }
      }
    });
    
    return stats;
  }

  async findPendingTransactions(): Promise<WalletTransaction[]> {
    const command = new ScanCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': TransactionStatus.PENDING
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new WalletTransaction(item as any));
  }

  async findFailedTransactions(): Promise<WalletTransaction[]> {
    const command = new ScanCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': TransactionStatus.FAILED
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new WalletTransaction(item as any));
  }

  // Batch operations for better performance
  async batchUpdateStatus(transactionIds: string[], status: TransactionStatus.COMPLETED | TransactionStatus.FAILED): Promise<WalletTransaction[]> {
    const updatedTransactions: WalletTransaction[] = [];
    
    // Process in batches (DynamoDB has limits on batch operations)
    const batchSize = 25;
    for (let i = 0; i < transactionIds.length; i += batchSize) {
      const batch = transactionIds.slice(i, i + batchSize);
      
      const updatePromises = batch.map(async (transactionId) => {
        const transaction = await this.findById(transactionId);
        if (transaction) {
          const updated = await this.updateStatus(transaction, status);
          updatedTransactions.push(updated);
        }
      });
      
      await Promise.all(updatePromises);
    }
    
    return updatedTransactions;
  }

  async delete(transaction: WalletTransaction): Promise<void> {
    const command = new DeleteCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      Key: { 
        userId: transaction.userId, 
        transactionId: transaction.transactionId 
      },
      ConditionExpression: '#status IN (:pending, :failed)', // Only delete pending or failed transactions
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':pending': TransactionStatus.PENDING,
        ':failed': TransactionStatus.FAILED
      }
    });
    
    try {
      await docClient.send(command);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Cannot delete completed transactions');
      }
      throw error;
    }
  }

  // Validation methods
  async validateTransactionExists(transactionId: string): Promise<void> {
    const transaction = await this.findById(transactionId);
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`);
    }
  }

  async validateNoDuplicateTransaction(userId: string, orderId: string, type: string): Promise<void> {
    const existingTransactions = await this.findByOrderId(orderId);
    const duplicate = existingTransactions.find(t => t.userId === userId && t.type === type);
    
    if (duplicate) {
      throw new Error(`Duplicate transaction found for user ${userId} and order ${orderId}`);
    }
  }
}

export const walletTransactionRepository = new WalletTransactionRepository(); 