import { mockAccountData, AccountInfo } from '../data/accountData'

// Cache for account data
let cachedAccountData: AccountInfo | null = null

// Simulate API delay
const simulateApiDelay = (ms: number = 100) =>
    new Promise(resolve => setTimeout(resolve, ms))

// Simulate a single API call that returns account data for the logged-in user
const fetchAccountDataFromAPI = async (_userId?: string): Promise<AccountInfo> => {
    await simulateApiDelay()
    
    if (!cachedAccountData) {
        // In a real app, this would be a single fetch call to your backend
        // const response = await fetch(`/api/account/${_userId}`);
        // cachedAccountData = await response.json();
        
        // Using mock data for now
        cachedAccountData = mockAccountData
    }
    
    return cachedAccountData
}

/**
 * Account Service - API-ready service layer
 * 
 * All methods fetch from a single API endpoint and process on the frontend.
 * When backend is ready, only the fetchAccountDataFromAPI function needs to be updated.
 */
export const accountService = {
    /**
     * Get account information for the current user
     */
    getAccountInfo: async (userId?: string): Promise<AccountInfo> => {
        return await fetchAccountDataFromAPI(userId)
    },

    /**
     * Update account information (first name, last name, phone)
     */
    updateAccountInfo: async (
        _userId: string,
        updates: Partial<Pick<AccountInfo, 'firstName' | 'lastName' | 'phone'>>
    ): Promise<AccountInfo> => {
        await simulateApiDelay()
        
        // In a real app, this would be a PUT/PATCH request
        // const response = await fetch(`/api/account/${_userId}`, {
        //     method: 'PATCH',
        //     body: JSON.stringify(updates)
        // });
        // cachedAccountData = await response.json();
        
        // For now, just update the cached data
        if (cachedAccountData) {
            cachedAccountData = {
                ...cachedAccountData,
                ...updates
            }
        }
        
        return cachedAccountData || mockAccountData
    },

    /**
     * Get wallet balance
     */
    getWalletBalance: async (userId?: string): Promise<number> => {
        const accountData = await fetchAccountDataFromAPI(userId)
        return accountData.walletBalance
    },

    /**
     * Add money to wallet
     */
    addMoneyToWallet: async (_userId: string, amount: number): Promise<AccountInfo> => {
        await simulateApiDelay()
        
        // In a real app, this would trigger a payment flow and then update wallet
        // const response = await fetch(`/api/wallet/${_userId}/add`, {
        //     method: 'POST',
        //     body: JSON.stringify({ amount })
        // });
        // cachedAccountData = await response.json();
        
        if (cachedAccountData) {
            cachedAccountData = {
                ...cachedAccountData,
                walletBalance: cachedAccountData.walletBalance + amount
            }
        }
        
        return cachedAccountData || mockAccountData
    },

    /**
     * Get account statistics (total orders, total gift cards, etc.)
     */
    getAccountStats: async (userId?: string): Promise<Pick<AccountInfo, 'totalOrders' | 'totalGiftCards'>> => {
        const accountData = await fetchAccountDataFromAPI(userId)
        return {
            totalOrders: accountData.totalOrders,
            totalGiftCards: accountData.totalGiftCards
        }
    },

    /**
     * Clear the cache (useful when user logs out)
     */
    clearCache: () => {
        cachedAccountData = null
    }
}

