import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { fetchCart, manageCart as manageCartAPI } from '../services/cartService'
import { CartItem as APICartItem } from '../types/cart'

// Frontend cart item interface for compatibility with existing UI
export interface CartItem {
    brandId: string
    brandSlug: string  // Derived from brandName for routing
    brandName: string
    brandLogo: string  // We'll need to fetch this or store it
    variantId: string
    variantValue: number  // Original price for display
    variantPrice: number  // Actual price (from unitPrice/100)
    quantity: number
    stockAvailable: number
    isInStock: boolean
}

interface CartContextType {
    items: CartItem[]
    addToCart: (variantId: string, quantity: number) => Promise<void>
    removeFromCart: (variantId: string) => Promise<void>
    updateQuantity: (variantId: string, quantity: number) => Promise<void>
    clearCart: () => void
    refreshCart: () => Promise<void>
    totalItems: number
    totalPrice: number
    isCartOpen: boolean
    openCart: () => void
    closeCart: () => void
    loading: boolean
    error: string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}

// Helper function to convert variant name to value (e.g., "₹500 Gift Card" -> 500)
const extractValueFromVariantName = (name: string): number => {
    const match = name.match(/₹?(\d+)/)
    return match ? parseInt(match[1]) : 0
}

// Helper function to convert API cart item to frontend cart item
const convertAPICartItem = (apiItem: APICartItem): CartItem => {
    // Create a slug from brand name (lowercase, replace spaces with hyphens)
    const brandSlug = apiItem.brandId // Use brandId as slug for now

    // Extract value from variant name
    const variantValue = extractValueFromVariantName(apiItem.variantName)

    return {
        brandId: apiItem.brandId,
        brandSlug,
        brandName: apiItem.brandName,
        brandLogo: apiItem.brandLogo,
        variantId: apiItem.variantId,
        variantValue,
        variantPrice: apiItem.unitPrice / 100, // Convert from paisa to rupees
        quantity: apiItem.quantity,
        stockAvailable: apiItem.stockAvailable,
        isInStock: apiItem.isInStock
    }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, openAuthSidebar } = useAuth()
    const [items, setItems] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch cart from API when user is authenticated
    const refreshCart = async () => {
        if (!isAuthenticated) {
            setItems([])
            return
        }

        setLoading(true)
        setError(null)

        try {
            const cart = await fetchCart()
            const frontendItems = cart.items.map(convertAPICartItem)
            setItems(frontendItems)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cart'
            setError(errorMessage)
            console.error('Failed to fetch cart:', err)

            // If unauthorized, clear cart
            if (errorMessage === 'UNAUTHORIZED') {
                setItems([])
            }
        } finally {
            setLoading(false)
        }
    }

    // Load cart on mount and when auth status changes
    useEffect(() => {
        refreshCart()
    }, [isAuthenticated])

    const addToCart = async (variantId: string, quantity: number) => {
        if (!isAuthenticated) {
            // Open login sidebar for logged-out users
            openAuthSidebar()
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Find existing item to calculate new quantity
            const existingItem = items.find(item => item.variantId === variantId)
            const newQuantity = existingItem ? existingItem.quantity + quantity : quantity

            await manageCartAPI({ variantId, quantity: newQuantity })
            await refreshCart()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add to cart'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const removeFromCart = async (variantId: string) => {
        if (!isAuthenticated) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Set quantity to 0 to remove the item
            await manageCartAPI({ variantId, quantity: 0 })
            await refreshCart()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to remove from cart'
            setError(errorMessage)
            console.error('Failed to remove from cart:', err)
        } finally {
            setLoading(false)
        }
    }

    const updateQuantity = async (variantId: string, quantity: number) => {
        if (!isAuthenticated) {
            // Open login sidebar for logged-out users
            openAuthSidebar()
            return
        }

        setLoading(true)
        setError(null)

        try {
            await manageCartAPI({ variantId, quantity })
            await refreshCart()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update quantity'
            setError(errorMessage)
            console.error('Failed to update quantity:', err)
        } finally {
            setLoading(false)
        }
    }

    const clearCart = () => {
        setItems([])
    }

    const openCart = () => setIsCartOpen(true)
    const closeCart = () => setIsCartOpen(false)

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.variantPrice * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                refreshCart,
                totalItems,
                totalPrice,
                isCartOpen,
                openCart,
                closeCart,
                loading,
                error
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
