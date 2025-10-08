import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, History, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const Navbar = () => {
    const location = useLocation();
    const { cart, toggleCart } = useStore();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 glass-dark border-b border-white/10 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 180, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-xl"
                        >
                            <Sparkles className="w-6 h-6 text-white" />
                        </motion.div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                            Giftify
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${location.pathname === '/'
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/50'
                                    : 'text-dark-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            Vouchers
                        </Link>

                        <Link
                            to="/orders"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${location.pathname === '/orders'
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/50'
                                    : 'text-dark-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <History className="w-4 h-4" />
                            Orders
                        </Link>

                        {/* Cart Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleCart}
                            className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-accent-600 to-accent-500 shadow-lg shadow-accent-500/50 transition-all hover:shadow-accent-500/70"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="hidden sm:inline">Cart</span>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

