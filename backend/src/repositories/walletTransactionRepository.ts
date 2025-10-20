import { PutCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { WalletTransaction, TransactionStatus, WALLET_TRANSACTION_TABLE, USER_TRANSACTION_HISTORY_GSI } from '../models/WalletTransactionModel';
import { PaginationParams, PaginatedResponse } from '../types/api';
import { docClient } from '../utils/database';

export class WalletTransactionRepository {
  async create(transaction: WalletTransaction): Promise<WalletTransaction> {
    const command = new PutCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      Item: transaction,
      ConditionExpression: 'attribute_not_exists(userId) AND attribute_not_exists(transactionId)'
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

  async findByUserId(
    userId: string,
    options: PaginationParams & { type?: string }
  ): Promise<PaginatedResponse<WalletTransaction>> {
    const { page = 1, limit = 20, type } = options;
    
    const command = new QueryCommand({
      TableName: WALLET_TRANSACTION_TABLE,
      IndexName: USER_TRANSACTION_HISTORY_GSI,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    });
    
    if (type) {
      command.input.FilterExpression = '#type = :type';
      command.input.ExpressionAttributeNames = { '#type': 'type' };
      command.input.ExpressionAttributeValues![':type'] = type;
    }
    
    const result = await docClient.send(command);
    let items = result.Items || [];
    
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
      ConditionExpression: 'attribute_exists(userId) AND attribute_exists(transactionId)'
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
}

export const walletTransactionRepository = new WalletTransactionRepository();
