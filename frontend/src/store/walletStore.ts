/**
 * Wallet Store
 * Zustand store for managing wallet state
 */

import { create } from 'zustand';
import { walletService } from '../services/walletService';
import type { 
  WalletBalanceResponse, 
  WalletTransaction, 
  TopupRequest 
} from '../types/wallet';

export interface WalletStore {
  // State
  balance: WalletBalanceResponse | null;
  transactions: WalletTransaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  topUp: (request: TopupRequest) => Promise<void>;
  clearError: () => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  // Initial state
  balance: null,
  transactions: [],
  isLoading: false,
  error: null,

  // Actions
  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const balance = await walletService.getBalance();
      set({
        balance,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch balance';
      set({
        isLoading: false,
        error: errorMessage
      });
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const transactions = await walletService.getTransactions();
      set({
        transactions,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
      set({
        isLoading: false,
        error: errorMessage
      });
    }
  },

  topUp: async (request: TopupRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      await walletService.topup(request);
      
      // Refresh balance and transactions after successful top-up
      await Promise.all([
        get().fetchBalance(),
        get().fetchTransactions()
      ]);
      
      set({
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to top up wallet';
      set({
        isLoading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  }
})); 