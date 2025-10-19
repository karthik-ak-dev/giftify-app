// Types for Account Data
export interface AccountInfo {
    userId: string
    email: string
    firstName: string
    lastName: string
    phone?: string
    walletBalance: number
    joinedDate: string
    totalOrders: number
    totalGiftCards: number
}

// Mock Account Data - Will be replaced by API
// In a real app, this would come from the backend based on the logged-in user
export const mockAccountData: AccountInfo = {
    userId: 'user-001',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+91 98765 43210',
    walletBalance: 250.00,
    joinedDate: '2024-01-15',
    totalOrders: 12,
    totalGiftCards: 28
}

