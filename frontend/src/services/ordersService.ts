import { ordersData, Order } from '../data/ordersData'

// Cache for orders data
let cachedOrders: Order[] | null = null

// Simulate API delay
const simulateApiDelay = (ms: number = 100) =>
    new Promise(resolve => setTimeout(resolve, ms))

// Simulate a single API call that returns all orders data for the logged-in user
const fetchAllOrdersFromAPI = async (_userId?: string): Promise<Order[]> => {
    await simulateApiDelay()
    
    if (!cachedOrders) {
        // In a real app, this would be a single fetch call to your backend
        // const response = await fetch(`/api/orders?userId=${_userId}`);
        // cachedOrders = await response.json();
        
        // Using mock data for now
        cachedOrders = ordersData
    }
    
    return cachedOrders
}

/**
 * Orders Service - API-ready service layer
 * 
 * All methods fetch from a single API endpoint and filter/sort on the frontend.
 * When backend is ready, only the fetchAllOrdersFromAPI function needs to be updated.
 */
export const ordersService = {
    /**
     * Get all orders for the current user
     */
    getAllOrders: async (userId?: string): Promise<Order[]> => {
        const allOrders = await fetchAllOrdersFromAPI(userId)
        // Sort by date (most recent first)
        return [...allOrders].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
    },

    /**
     * Get a specific order by ID
     */
    getOrderById: async (orderId: string, userId?: string): Promise<Order | null> => {
        const allOrders = await fetchAllOrdersFromAPI(userId)
        const order = allOrders.find(o => o.orderId === orderId)
        return order || null
    },

    /**
     * Get orders filtered by status
     */
    getOrdersByStatus: async (
        status: Order['status'], 
        userId?: string
    ): Promise<Order[]> => {
        const allOrders = await fetchAllOrdersFromAPI(userId)
        return allOrders
            .filter(order => order.status === status)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    },

    /**
     * Get orders within a date range
     */
    getOrdersByDateRange: async (
        startDate: string, 
        endDate: string, 
        userId?: string
    ): Promise<Order[]> => {
        const allOrders = await fetchAllOrdersFromAPI(userId)
        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()
        
        return allOrders
            .filter(order => {
                const orderDate = new Date(order.date).getTime()
                return orderDate >= start && orderDate <= end
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    },

    /**
     * Get total count of orders
     */
    getOrdersCount: async (userId?: string): Promise<number> => {
        const allOrders = await fetchAllOrdersFromAPI(userId)
        return allOrders.length
    },

    /**
     * Get total amount spent across all orders
     */
    getTotalSpent: async (userId?: string): Promise<number> => {
        const allOrders = await fetchAllOrdersFromAPI(userId)
        return allOrders.reduce((total, order) => total + order.total, 0)
    },

    /**
     * Clear the cache (useful when user logs out or new order is placed)
     */
    clearCache: () => {
        cachedOrders = null
    }
}

