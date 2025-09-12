import { WalletTransaction } from '../types/wallet';

export class WalletTransactionModel {
  static readonly tableName = process.env.WALLET_TRANSACTIONS_TABLE || 'giftify-wallet-transactions';
  
  // Primary Key
  static readonly partitionKey = 'userId';
  static readonly sortKey = 'transactionId';
  
  // GSI Keys
  static readonly transactionIdGSI = 'TransactionIdIndex';
  static readonly transactionIdGSIKey = 'transactionId';
  
  static readonly userTransactionHistoryGSI = 'UserTransactionHistoryIndex';
  static readonly userTransactionHistoryGSIPartitionKey = 'userId';
  static readonly userTransactionHistoryGSISortKey = 'createdAt';
  
  // Table schema definition
  static readonly schema = {
    userId: 'string',           // Partition Key
    transactionId: 'string',    // Sort Key - ULID
    type: 'string',             // CREDIT, DEBIT, REFUND
    amount: 'number',           // In cents/paise
    balanceAfter: 'number',     // In cents/paise
    description: 'string',
    orderId: 'string',          // Optional - for order-related transactions
    status: 'string',           // PENDING, COMPLETED, FAILED
    createdAt: 'string',        // ISO timestamp - GSI2 Sort Key
    updatedAt: 'string'         // ISO timestamp
  };
  
  // Default values
  static readonly defaults = {
    status: 'PENDING'
  };
  
  // Validation rules
  static readonly validation = {
    type: {
      required: true,
      enum: ['CREDIT', 'DEBIT', 'REFUND']
    },
    amount: {
      required: true,
      min: 1
    },
    status: {
      required: true,
      enum: ['PENDING', 'COMPLETED', 'FAILED']
    }
  };
  
  // Transform DB item to WalletTransaction interface
  static toWalletTransaction(item: any): WalletTransaction {
    return {
      userId: item.userId,
      transactionId: item.transactionId,
      type: item.type,
      amount: item.amount,
      balanceAfter: item.balanceAfter,
      description: item.description,
      orderId: item.orderId,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }
} 