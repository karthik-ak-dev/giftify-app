import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { 
  WalletBalance, 
  WalletTransaction, 
  TopupRequest, 
  TopupResponse,
  TransactionFilters
} from '../types/wallet';

export const walletService = {
  /**
   * Get wallet balance
   */
  getBalance: async (): Promise<WalletBalance> => {
    const response = await apiClient.get<WalletBalance>(API_ENDPOINTS.WALLET_BALANCE);
    return response.data!;
  },

  /**
   * Top up wallet
   */
  topupWallet: async (request: TopupRequest): Promise<TopupResponse> => {
    const response = await apiClient.post<TopupResponse>(
      API_ENDPOINTS.WALLET_TOPUP,
      request
    );
    return response.data!;
  },

  /**
   * Get transaction history
   */
  getTransactions: async (filters?: TransactionFilters): Promise<{ transactions: WalletTransaction[] }> => {
    const response = await apiClient.get<{ transactions: WalletTransaction[] }>(
      API_ENDPOINTS.WALLET_TRANSACTIONS,
      filters as Record<string, unknown>
    );
    return response.data!;
  },
}; 