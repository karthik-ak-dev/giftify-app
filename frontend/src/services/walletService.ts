/**
 * Wallet Service
 * Handles wallet-related API calls
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { 
  WalletBalanceResponse, 
  WalletTransaction, 
  TopupRequest, 
  TopupResponse,
  TransactionFilters 
} from '../types/wallet';

export const walletService = {
  /**
   * Get wallet balance
   */
  getBalance: async (): Promise<WalletBalanceResponse> => {
    const response = await apiClient.get<{
      success: boolean;
      data: WalletBalanceResponse;
    }>(API_ENDPOINTS.WALLET_BALANCE);
    
    if (!response.data?.success || !response.data.data) {
      throw new Error('Failed to fetch wallet balance');
    }
    
    return response.data.data;
  },

  /**
   * Get wallet transactions
   */
  getTransactions: async (filters?: TransactionFilters): Promise<WalletTransaction[]> => {
    const response = await apiClient.get<{
      success: boolean;
      data: { transactions: WalletTransaction[] };
    }>(API_ENDPOINTS.WALLET_TRANSACTIONS, { params: filters });
    
    if (!response.data?.success || !response.data.data) {
      throw new Error('Failed to fetch transactions');
    }
    
    return response.data.data.transactions;
  },

  /**
   * Top up wallet
   */
  topup: async (request: TopupRequest): Promise<TopupResponse> => {
    const response = await apiClient.post<{
      success: boolean;
      data: TopupResponse;
    }>(API_ENDPOINTS.WALLET_TOPUP, request);
    
    if (!response.data?.success || !response.data.data) {
      throw new Error('Failed to top up wallet');
    }
    
    return response.data.data;
  }
}; 