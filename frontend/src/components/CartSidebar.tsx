import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/formatters';

const CartSidebar = () => {
    const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart, placeOrder } = useStore();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-96 glass-dark border-l border-white/10 shadow-2xl z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <ShoppingBag className="w-6 h-6 text-primary-400" />
                                    Your Cart
                                </h2>
                                <button
                                    onClick={() => setCartOpen(false)}
                                    className="p-2 rounded-xl glass hover:bg-white/10 transition-all"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                            <p className="text-sm text-dark-400 mt-1">
                                {cart.length} {cart.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="text-6xl mb-4">🛒</div>
                                    <p className="text-lg font-medium text-white mb-2">Your cart is empty</p>
                                    <p className="text-sm text-dark-400">Add some vouchers to get started!</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        key={`${item.voucherId}-${item.variantId}`}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="glass rounded-xl p-4 space-y-3"
                                    >
                                        {/* Item Info */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-white">{item.voucherName}</h3>
                                                <p className="text-sm text-dark-400">
                                                    {formatCurrency(item.denomination)} Voucher
                                                </p>
                                                <p className="text-lg font-bold text-primary-400 mt-1">
                                                    {formatCurrency(item.price)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.voucherId, item.variantId)}
                                                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => updateQuantity(item.voucherId, item.variantId, item.quantity - 1)}
                                                    className="p-2 rounded-lg glass hover:bg-white/10 transition-all"
                                                >
                                                    <Minus className="w-4 h-4 text-white" />
                                                </motion.button>
                                                <span className="w-8 text-center font-semibold text-white">
                                                    {item.quantity}
                                                </span>
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => updateQuantity(item.voucherId, item.variantId, item.quantity + 1)}
                                                    className="p-2 rounded-lg glass hover:bg-white/10 transition-all"
                                                >
                                                    <Plus className="w-4 h-4 text-white" />
                                                </motion.button>
                                            </div>
                                            <p className="font-semibold text-white">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-white/10 space-y-4">
                                {/* Total */}
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium text-dark-300">Total</span>
                                    <span className="text-2xl font-bold text-white">
                                        {formatCurrency(total)}
                                    </span>
                                </div>

                                {/* Place Order Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={placeOrder}
                                    className="w-full btn-primary text-lg py-4"
                                >
                                    Place Order
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;

