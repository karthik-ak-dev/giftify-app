import { create } from 'zustand';
import { walletService } from '../services/walletService';
import { SUCCESS_MESSAGES } from '../utils/constants';
import type { 
  WalletState, 
  WalletActions, 
  TopupRequest, 
  TransactionFilters 
} from '../types/wallet';

type WalletStore = WalletState & WalletActions;

export const useWalletStore = create<WalletStore>((set, get) => ({
  // State
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasNext: false,
  },

  // Actions
  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const walletBalance = await walletService.getBalance();
      
      set({
        balance: walletBalance.balance,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'error' in error 
        ? (error as { error?: { message?: string } }).error?.message || 'Failed to fetch balance'
        : 'Failed to fetch balance';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  fetchTransactions: async (filters?: TransactionFilters) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await walletService.getTransactions(filters);
      
      set({
        transactions: response.transactions,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'error' in error 
        ? (error as { error?: { message?: string } }).error?.message || 'Failed to fetch transactions'
        : 'Failed to fetch transactions';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  topupWallet: async (request: TopupRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await walletService.topupWallet(request);
      
      // Update balance
      set({
        balance: response.newBalance,
        isLoading: false,
        error: null,
      });

      // Refresh transactions to show the new topup
      get().fetchTransactions();

      // Show success message
      console.log(SUCCESS_MESSAGES.WALLET_TOPPED_UP);
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'error' in error 
        ? (error as { error?: { message?: string } }).error?.message || 'Failed to top up wallet'
        : 'Failed to top up wallet';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
})); 