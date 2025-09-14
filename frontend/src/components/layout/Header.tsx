import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
    User,
    Wallet,
    LogOut,
    Menu,
    X,
    ChevronDown
} from 'lucide-react';

// Components
import { Button } from '../ui/Button';

// Hooks and Stores
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWalletStore } from '../../store/walletStore';

// Utils
import { formatCurrency } from '../../utils/formatters';

interface HeaderProps {
    onAuthClick?: (mode?: 'login' | 'register') => void;
}

/**
 * Header Component
 * 
 * Main navigation header with:
 * - Logo and brand
 * - Navigation links
 * - User authentication (login/register for guests, profile for authenticated)
 * - Cart and wallet for authenticated users
 * - Mobile responsive design
 * - Dropdown menus with animations
 */
const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
    // ===== HOOKS & STATE =====
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuthStore();
    const { toggleCart, totalItems } = useCartStore();
    const { balance, fetchBalance } = useWalletStore();

    // UI state
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Refs for click outside detection
    const userMenuRef = useRef<HTMLDivElement>(null);

    // ===== LIFECYCLE EFFECTS =====

    /**
     * Fetch wallet balance when user is authenticated
     */
    useEffect(() => {
        if (isAuthenticated && user) {
            fetchBalance();
        }
    }, [isAuthenticated, user, fetchBalance]);

    /**
     * Close user menu when clicking outside
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /**
     * Close mobile menu when route changes
     */
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [navigate]);

    // ===== EVENT HANDLERS =====

    /**
     * Handle user logout
     */
    const handleLogout = async () => {
        try {
            await logout();
            setIsUserMenuOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    /**
     * Toggle cart sidebar
     */
    const handleCartClick = () => {
        toggleCart();
    };

    /**
     * Toggle user menu dropdown
     */
    const toggleUserMenu = () => {
        setIsUserMenuOpen(prev => !prev);
    };

    /**
     * Toggle mobile navigation menu
     */
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    /**
     * Navigate to profile and close menus
     */
    const handleProfileClick = () => {
        setIsUserMenuOpen(false);
        navigate('/profile');
    };

    // ===== RENDER HELPERS =====

    /**
     * Render wallet balance with loading state
     */
    const renderWalletBalance = () => (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-button flex items-center space-x-2 px-4 py-2 cursor-pointer"
            onClick={() => navigate('/wallet')}
        >
            <Wallet size={18} className="text-accent-pink" />
            <span className="font-medium">
                {balance !== null ? formatCurrency(balance.balance) : '...'}
            </span>
        </motion.div>
    );

    /**
     * Render cart button with item count badge
     */
    const renderCartButton = () => (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCartClick}
            className="relative glass-button p-3"
            aria-label={`Shopping cart with ${totalItems} items`}
        >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-accent-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                >
                    {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
            )}
        </motion.button>
    );

    /**
     * Render user menu dropdown
     */
    const renderUserMenu = () => (
        <div className="relative" ref={userMenuRef}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleUserMenu}
                className="glass-button p-3 flex items-center gap-2"
                aria-label="User menu"
            >
                <User size={20} />
                <ChevronDown
                    size={16}
                    className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isUserMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 glass-card border border-glass-border rounded-lg shadow-lg z-50"
                    >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-glass-border">
                            <p className="text-sm font-medium text-text-primary">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-text-secondary truncate">
                                {user?.email}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <button
                                onClick={handleProfileClick}
                                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-glass-bg transition-colors flex items-center gap-3"
                            >
                                <User size={16} />
                                Profile & Settings
                            </button>

                            <button
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                    navigate('/wallet');
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-glass-bg transition-colors flex items-center gap-3"
                            >
                                <Wallet size={16} />
                                Wallet & Transactions
                            </button>

                            <hr className="my-2 border-glass-border" />

                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    /**
     * Render navigation links
     */
    const renderNavLinks = () => (
        <>
            <Link
                to="/"
                className="text-text-primary hover:text-accent-pink transition-colors font-medium"
            >
                Home
            </Link>
            <Link
                to="/categories"
                className="text-text-primary hover:text-accent-pink transition-colors font-medium"
            >
                Categories
            </Link>
            <Link
                to="/orders"
                className="text-text-primary hover:text-accent-pink transition-colors font-medium"
            >
                My Orders
            </Link>
        </>
    );

    /**
     * Render mobile menu
     */
    const renderMobileMenu = () => (
        <AnimatePresence>
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                        onClick={toggleMobileMenu}
                    />

                    {/* Mobile Menu */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed left-0 top-0 h-full w-80 glass-card border-r border-glass-border z-50 md:hidden"
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="text-2xl font-bold neon-text">
                                    🎁 Giftify
                                </div>
                                <button
                                    onClick={toggleMobileMenu}
                                    className="p-2 hover:bg-glass-bg rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* User Info */}
                            {user && (
                                <div className="mb-6 p-4 glass-bg rounded-lg">
                                    <p className="font-medium text-text-primary">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                        {user.email}
                                    </p>
                                </div>
                            )}

                            {/* Navigation Links */}
                            <nav className="space-y-4 mb-8">
                                <Link
                                    to="/"
                                    className="block py-2 text-text-primary hover:text-accent-pink transition-colors"
                                    onClick={toggleMobileMenu}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/categories"
                                    className="block py-2 text-text-primary hover:text-accent-pink transition-colors"
                                    onClick={toggleMobileMenu}
                                >
                                    Categories
                                </Link>
                                <Link
                                    to="/orders"
                                    className="block py-2 text-text-primary hover:text-accent-pink transition-colors"
                                    onClick={toggleMobileMenu}
                                >
                                    My Orders
                                </Link>
                                <Link
                                    to="/profile"
                                    className="block py-2 text-text-primary hover:text-accent-pink transition-colors"
                                    onClick={toggleMobileMenu}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/wallet"
                                    className="block py-2 text-text-primary hover:text-accent-pink transition-colors"
                                    onClick={toggleMobileMenu}
                                >
                                    Wallet
                                </Link>
                            </nav>

                            {/* Logout Button */}
                            <Button
                                onClick={handleLogout}
                                variant="secondary"
                                className="w-full"
                            >
                                <LogOut size={16} className="mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    // ===== MAIN RENDER =====

    return (
        <>
            <header className="sticky top-0 z-40 glass-card border-b border-glass-border backdrop-blur-md">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Left Section - Logo & Mobile Menu */}
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Button - only for authenticated users */}
                            {isAuthenticated && (
                                <button
                                    onClick={toggleMobileMenu}
                                    className="md:hidden p-2 hover:bg-glass-bg rounded-lg transition-colors"
                                    aria-label="Open menu"
                                >
                                    <Menu size={24} />
                                </button>
                            )}

                            {/* Logo */}
                            <Link to="/" className="flex items-center space-x-2">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="text-2xl font-bold neon-text"
                                >
                                    🎁 Giftify
                                </motion.div>
                            </Link>
                        </div>

                        {/* Center Section - Navigation (Desktop) - only for authenticated users */}
                        {isAuthenticated && (
                            <nav className="hidden md:flex items-center space-x-8">
                                {renderNavLinks()}
                            </nav>
                        )}

                        {/* Right Section - Actions */}
                        <div className="flex items-center space-x-3">
                            {isAuthenticated ? (
                                <>
                                    {/* Wallet Balance */}
                                    {renderWalletBalance()}

                                    {/* Cart Button */}
                                    {renderCartButton()}

                                    {/* User Menu */}
                                    {renderUserMenu()}
                                </>
                            ) : (
                                /* Auth Buttons for non-authenticated users */
                                <div className="flex items-center space-x-3">
                                    <Button
                                        onClick={() => onAuthClick?.('login')}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        onClick={() => onAuthClick?.('register')}
                                        variant="primary"
                                        size="sm"
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu - only for authenticated users */}
            {isAuthenticated && renderMobileMenu()}
        </>
    );
};

export default Header; 