import { createContext, useContext, useState, ReactNode } from 'react'

export interface CartItem {
    brandSlug: string
    brandName: string
    brandLogo: string
    variantValue: number
    variantPrice: number
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void
    removeFromCart: (brandSlug: string, variantValue: number) => void
    updateQuantity: (brandSlug: string, variantValue: number, quantity: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
    isCartOpen: boolean
    openCart: () => void
    closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)

    const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
        setItems(prev => {
            const existingIndex = prev.findIndex(
                i => i.brandSlug === item.brandSlug && i.variantValue === item.variantValue
            )

            if (existingIndex >= 0) {
                const updated = [...prev]
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity
                }
                return updated
            }

            return [...prev, { ...item, quantity }]
        })
    }

    const removeFromCart = (brandSlug: string, variantValue: number) => {
        setItems(prev => prev.filter(
            item => !(item.brandSlug === brandSlug && item.variantValue === variantValue)
        ))
    }

    const updateQuantity = (brandSlug: string, variantValue: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(brandSlug, variantValue)
            return
        }

        setItems(prev => {
            const index = prev.findIndex(
                i => i.brandSlug === brandSlug && i.variantValue === variantValue
            )
            if (index >= 0) {
                const updated = [...prev]
                updated[index] = { ...updated[index], quantity }
                return updated
            }
            return prev
        })
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
                totalItems,
                totalPrice,
                isCartOpen,
                openCart,
                closeCart
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

