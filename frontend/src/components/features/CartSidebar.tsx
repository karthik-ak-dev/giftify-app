import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';

// UI Components
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

// Store hooks
import { useCartStore } from '../../store/cartStore';

// Utils
import { formatCurrency } from '../../utils/formatters';

// Types
import type { CartItem } from '../../types/cart';

/**
 * Cart Sidebar Component
 * 
 * Features:
 * - Slide-in animation from right
 * - Real-time cart items display
 * - Quantity controls (increase/decrease)
 * - Item removal functionality
 * - Total amount calculation
 * - Empty state with call-to-action
 * - Loading states for all operations
 * - Responsive design for mobile
 * - Backdrop click to close
 */
const CartSidebar: React.FC = () => {
    // Cart store state and actions
    const {
        items,
        totalAmount,
        totalItems,
        isLoading,
        error,
        isOpen,
        closeCart,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
        clearError
    } = useCartStore();

    /**
     * Fetch cart data when sidebar opens
     */
    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen, fetchCart]);

    /**
     * Handle backdrop click to close sidebar
     */
    const handleBackdropClick = () => {
        closeCart();
    };

    /**
     * Handle quantity increase
     */
    const handleIncreaseQuantity = async (item: CartItem) => {
        try {
            await updateQuantity(item.variantId, item.quantity + 1);
        } catch (error) {
            console.error('Failed to increase quantity:', error);
        }
    };

    /**
     * Handle quantity decrease
     */
    const handleDecreaseQuantity = async (item: CartItem) => {
        if (item.quantity > 1) {
            try {
                await updateQuantity(item.variantId, item.quantity - 1);
            } catch (error) {
                console.error('Failed to decrease quantity:', error);
            }
        }
    };

    /**
     * Handle item removal
     */
    const handleRemoveItem = async (variantId: string) => {
        try {
            await removeItem(variantId);
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    /**
     * Handle clear entire cart
     */
    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your entire cart?')) {
            try {
                await clearCart();
            } catch (error) {
                console.error('Failed to clear cart:', error);
            }
        }
    };

    /**
     * Handle checkout navigation
     */
    const handleCheckout = () => {
        // TODO: Implement checkout flow
        alert('Checkout functionality coming soon!');
        closeCart();
    };

    // Don't render if cart is not open
    if (!isOpen) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleBackdropClick}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Sidebar */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed right-0 top-0 h-full w-full max-w-md bg-bg-secondary border-l border-glass-border z-50 overflow-y-auto"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-glass-border">
                        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                            <ShoppingBag size={24} />
                            Your Cart
                            {totalItems > 0 && (
                                <span className="bg-accent-pink text-white text-sm px-2 py-1 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </h2>
                        <button
                            onClick={closeCart}
                            className="p-2 hover:bg-glass-bg rounded-lg transition-colors"
                            aria-label="Close cart"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-red-400 text-sm">{error}</p>
                                <button
                                    onClick={clearError}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            /* Loading State */
                            <div className="flex items-center justify-center py-12">
                                <LoadingSpinner size="lg" />
                            </div>
                        ) : items.length === 0 ? (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center py-12 px-6">
                                <div className="w-24 h-24 bg-glass-bg rounded-full flex items-center justify-center mb-4">
                                    <ShoppingBag size={32} className="text-text-secondary" />
                                </div>
                                <h3 className="text-lg font-medium text-text-primary mb-2">
                                    Your cart is empty
                                </h3>
                                <p className="text-text-secondary text-center mb-6">
                                    Add some amazing gift cards to get started!
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={closeCart}
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        ) : (
                            /* Cart Items */
                            <div className="p-6 space-y-4">
                                {/* Clear Cart Button */}
                                {items.length > 0 && (
                                    <div className="flex justify-end mb-4">
                                        <button
                                            onClick={handleClearCart}
                                            className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                            disabled={isLoading}
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                )}

                                {/* Cart Items List */}
                                {items.map((item) => (
                                    <motion.div
                                        key={item.variantId}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="glass-card p-4 space-y-3"
                                    >
                                        {/* Item Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-text-primary">
                                                    {item.productName}
                                                </h4>
                                                <p className="text-sm text-text-secondary">
                                                    {formatCurrency(item.sellingPrice)} each
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.variantId)}
                                                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                                disabled={isLoading}
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => handleDecreaseQuantity(item)}
                                                    disabled={isLoading || item.quantity <= 1}
                                                    className="w-8 h-8 rounded-full bg-glass-bg hover:bg-glass-border transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Minus size={16} />
                                                </button>

                                                <span className="w-12 text-center font-medium">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() => handleIncreaseQuantity(item)}
                                                    disabled={isLoading}
                                                    className="w-8 h-8 rounded-full bg-glass-bg hover:bg-glass-border transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            {/* Item Total */}
                                            <div className="text-right">
                                                <p className="font-semibold text-text-primary">
                                                    {formatCurrency(item.totalPrice)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer - Checkout Section */}
                    {items.length > 0 && (
                        <div className="border-t border-glass-border p-6 space-y-4">
                            {/* Total Amount */}
                            <div className="flex items-center justify-between text-lg font-semibold">
                                <span className="text-text-primary">Total:</span>
                                <span className="text-accent-pink">
                                    {formatCurrency(totalAmount)}
                                </span>
                            </div>

                            {/* Checkout Button */}
                            <Button
                                onClick={handleCheckout}
                                className="w-full"
                                disabled={isLoading || items.length === 0}
                                loading={isLoading}
                            >
                                Proceed to Checkout
                            </Button>

                            {/* Continue Shopping Link */}
                            <button
                                onClick={closeCart}
                                className="w-full text-center text-text-secondary hover:text-text-primary transition-colors py-2"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default CartSidebar; 