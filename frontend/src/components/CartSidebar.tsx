import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const CartSidebar = () => {
    const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart()
    const { isAuthenticated, openAuthSidebar } = useAuth()
    const navigate = useNavigate()

    const handleCheckout = () => {
        // Check if user is logged in
        if (!isAuthenticated) {
            // Close cart and open auth sidebar
            closeCart()
            openAuthSidebar()
            return
        }

        // Navigate to checkout page if authenticated
        closeCart()
        navigate('/checkout')
    }

    if (!isCartOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-50 shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-dark-100/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Your Cart</h2>
                            <p className="text-sm text-white/60">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                        </div>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-colors"
                    >
                        <X className="w-6 h-6 text-white/70" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <ShoppingCart className="w-10 h-10 text-white/30" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
                            <p className="text-white/60 mb-6">Add some gift cards to get started!</p>
                            <button
                                onClick={closeCart}
                                className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => {
                            const discountPercent = ((item.variantValue - item.variantPrice) / item.variantValue * 100).toFixed(1)

                            return (
                                <div
                                    key={`${item.brandSlug}-${item.variantValue}`}
                                    className="bg-white/5 rounded-xl border border-white/10 p-4 hover:border-accent-400/30 transition-colors"
                                >
                                    <div className="flex gap-4">
                                        {/* Brand Logo */}
                                        <div className="w-16 h-16 bg-white/95 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.brandLogo}
                                                alt={item.brandName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <h3 className="text-white font-semibold">{item.brandName}</h3>
                                                    <p className="text-white/60 text-sm">₹{item.variantValue} Gift Card</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.brandSlug, item.variantValue)}
                                                    className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors group"
                                                >
                                                    <Trash2 className="w-4 h-4 text-white/40 group-hover:text-red-400" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-accent-400 font-bold">₹{item.variantPrice}</span>
                                                        <span className="text-white/40 text-xs line-through">₹{item.variantValue}</span>
                                                        <span className="text-green-400 text-xs font-semibold">{discountPercent}% OFF</span>
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.brandSlug, item.variantValue, item.quantity - 1)}
                                                        className="w-7 h-7 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <div className="w-10 h-7 bg-accent-500/20 border border-accent-400/40 text-white rounded-lg font-bold flex items-center justify-center text-sm">
                                                        {item.quantity}
                                                    </div>
                                                    <button
                                                        onClick={() => updateQuantity(item.brandSlug, item.variantValue, item.quantity + 1)}
                                                        className="w-7 h-7 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors flex items-center justify-center"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-white/10 p-6 bg-dark-100/50 space-y-4">
                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-white/70 font-medium">Total Amount</span>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">₹{totalPrice.toFixed(2)}</div>
                                <div className="text-xs text-green-400 font-semibold">
                                    You save ₹{items.reduce((sum, item) => sum + (item.variantValue - item.variantPrice) * item.quantity, 0).toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-accent-500/50 hover:scale-105"
                        >
                            <span>Proceed to Checkout</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default CartSidebar

