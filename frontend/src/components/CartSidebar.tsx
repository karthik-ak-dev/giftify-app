import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, AlertCircle } from 'lucide-react'
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
                className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-elegant-2xl z-50 flex flex-col animate-slide-down">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-accent-50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-elegant-md">
                            <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">Your Cart</h2>
                            <p className="text-sm text-neutral-600">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                        </div>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-10 h-10 rounded-xl hover:bg-neutral-100 flex items-center justify-center transition-all elegant-button"
                    >
                        <X className="w-5 h-5 text-neutral-600" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin bg-gradient-to-b from-neutral-50 to-neutral-100">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4 border-4 border-neutral-200">
                                <ShoppingCart className="w-12 h-12 text-neutral-400" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">Your cart is empty</h3>
                            <p className="text-neutral-600 mb-6 max-w-xs">Add some gift cards to get started on your shopping journey!</p>
                            <button
                                onClick={closeCart}
                                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-semibold elegant-button shadow-elegant-md"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => {
                            const discountPercent = item.variantValue > 0
                                ? ((item.variantValue - item.variantPrice) / item.variantValue * 100).toFixed(1)
                                : '0'

                            return (
                                <div
                                    key={item.variantId}
                                    className="elegant-card p-4 hover:shadow-elegant-lg transition-all"
                                >
                                    <div className="flex gap-4">
                                        {/* Brand Logo */}
                                        <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-200">
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
                                                    <h3 className="text-neutral-900 font-semibold">{item.brandName}</h3>
                                                    <p className="text-neutral-600 text-sm">₹{item.variantValue} Gift Card</p>
                                                    {!item.isInStock && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <AlertCircle className="w-3 h-3 text-red-500" />
                                                            <p className="text-red-500 text-xs font-semibold">Out of Stock</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.variantId)}
                                                    className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-all group"
                                                >
                                                    <Trash2 className="w-4 h-4 text-neutral-400 group-hover:text-red-500 transition-colors" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-primary-600 font-bold text-lg">₹{item.variantPrice.toFixed(2)}</span>
                                                        <span className="text-neutral-400 text-xs line-through">₹{item.variantValue}</span>
                                                        <span className="text-success-600 text-xs font-semibold bg-success-50 px-2 py-0.5 rounded-full">{discountPercent}% OFF</span>
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                                        className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-all flex items-center justify-center elegant-button"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <div className="min-w-[40px] h-8 bg-primary-50 border-2 border-primary-200 text-primary-700 rounded-lg font-bold flex items-center justify-center text-sm px-2">
                                                        {item.quantity}
                                                    </div>
                                                    <button
                                                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                                        disabled={!item.isInStock || item.quantity >= item.stockAvailable}
                                                        className="w-8 h-8 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center justify-center elegant-button"
                                                    >
                                                        <Plus className="w-4 h-4" />
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
                    <div className="border-t border-neutral-200 p-6 bg-white space-y-4 shadow-elegant-xl">
                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-700 font-medium">Total Amount</span>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-neutral-900">₹{totalPrice.toFixed(2)}</div>
                                <div className="text-xs text-success-600 font-semibold">
                                    You save ₹{items.reduce((sum, item) => sum + (item.variantValue - item.variantPrice) * item.quantity, 0).toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-bold text-lg elegant-button flex items-center justify-center gap-2 shadow-elegant-lg"
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
