import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 glass-card border-b border-glass-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-2xl font-bold neon-text"
                        >
                            🎁 Giftify
                        </motion.div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-text-primary hover:text-accent-pink transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/profile"
                            className="text-text-primary hover:text-accent-pink transition-colors"
                        >
                            Profile
                        </Link>
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Wallet Badge */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="glass-button flex items-center space-x-2 px-4 py-2"
                        >
                            <Wallet size={18} />
                            <span className="font-medium">₹0.00</span>
                        </motion.div>

                        {/* Cart Icon */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative glass-button p-3"
                        >
                            <ShoppingCart size={20} />
                            <span className="absolute -top-1 -right-1 bg-accent-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                0
                            </span>
                        </motion.button>

                        {/* Profile Icon */}
                        <Link to="/profile">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="glass-button p-3"
                            >
                                <User size={20} />
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 