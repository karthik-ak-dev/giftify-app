import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Wallet,
    CreditCard,
    History,
    Edit3,
    Save,
    X,
    Plus,
    ArrowUpRight,
    ArrowDownLeft
} from 'lucide-react';

// UI Components
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Store hooks
import { useAuthStore } from '../store/authStore';
import { useWalletStore } from '../store/walletStore';

// Utils
import { formatCurrency, formatDate } from '../utils/formatters';
import { validateName } from '../utils/validators';

// Types
import type { ProfileData } from '../types/auth';
import type { WalletTransaction, TransactionType } from '../types/wallet';

/**
 * Profile Page Component
 * 
 * Features:
 * - User profile information display and editing
 * - Wallet balance and top-up functionality
 * - Transaction history with filtering
 * - Order history (placeholder for future implementation)
 * - Profile picture upload (placeholder)
 * - Account settings and preferences
 * - Responsive design with tabbed interface
 * - Real-time data updates
 */
const Profile: React.FC = () => {
    // Store state and actions
    const { user, updateProfile, isLoading: authLoading } = useAuthStore();
    const {
        balance,
        transactions,
        isLoading: walletLoading,
        fetchBalance,
        fetchTransactions,
        topUp
    } = useWalletStore();

    // Local state
    const [activeTab, setActiveTab] = useState<'profile' | 'wallet' | 'orders'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState('');
    const [showTopUpModal, setShowTopUpModal] = useState(false);

    // Profile editing state
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
    });

    const [validationErrors, setValidationErrors] = useState<Partial<ProfileData>>({});

    /**
     * Load initial data on component mount
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    fetchBalance(),
                    fetchTransactions()
                ]);
            } catch (error) {
                console.error('Failed to load profile data:', error);
            }
        };

        loadData();
    }, [fetchBalance, fetchTransactions]);

    /**
     * Update profile data when user changes
     */
    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName,
                lastName: user.lastName,
            });
        }
    }, [user]);

    /**
     * Handle profile form submission
     */
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        const errors: Partial<ProfileData> = {};

        if (profileData.firstName && !validateName(profileData.firstName)) {
            errors.firstName = 'First name must be at least 2 characters';
        }

        if (profileData.lastName && !validateName(profileData.lastName)) {
            errors.lastName = 'Last name must be at least 2 characters';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            await updateProfile(profileData);
            setIsEditing(false);
            setValidationErrors({});
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    /**
     * Handle profile input changes
     */
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData((prev: ProfileData) => ({ ...prev, [name]: value }));

        // Clear validation error for this field
        if (validationErrors[name as keyof ProfileData]) {
            setValidationErrors((prev: Partial<ProfileData>) => ({ ...prev, [name]: undefined }));
        }
    };

    /**
     * Handle wallet top-up
     */
    const handleTopUp = async () => {
        const amount = parseFloat(topUpAmount);

        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (amount < 10) {
            alert('Minimum top-up amount is ₹10');
            return;
        }

        if (amount > 50000) {
            alert('Maximum top-up amount is ₹50,000');
            return;
        }

        try {
            await topUp({ amount });
            setShowTopUpModal(false);
            setTopUpAmount('');

            // Refresh data
            await Promise.all([
                fetchBalance(),
                fetchTransactions()
            ]);
        } catch (error) {
            console.error('Failed to top up wallet:', error);
            alert('Failed to top up wallet. Please try again.');
        }
    };

    /**
     * Get transaction icon based on type
     */
    const getTransactionIcon = (transaction: WalletTransaction) => {
        switch (transaction.type as TransactionType) {
            case 'TOPUP':
                return <ArrowDownLeft size={16} className="text-green-400" />;
            case 'ORDER_PAYMENT':
                return <ArrowUpRight size={16} className="text-red-400" />;
            case 'REFUND':
                return <ArrowDownLeft size={16} className="text-blue-400" />;
            default:
                return <CreditCard size={16} className="text-text-secondary" />;
        }
    };

    /**
     * Get transaction color based on type
     */
    const getTransactionColor = (transaction: WalletTransaction) => {
        switch (transaction.type as TransactionType) {
            case 'TOPUP':
            case 'REFUND':
                return 'text-green-400';
            case 'ORDER_PAYMENT':
                return 'text-red-400';
            default:
                return 'text-text-secondary';
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold neon-text mb-2">My Profile</h1>
                <p className="text-text-secondary">Manage your account and preferences</p>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
                className="flex justify-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="glass-card p-1 flex space-x-1">
                    {[
                        { id: 'profile', label: 'Profile', icon: User },
                        { id: 'wallet', label: 'Wallet', icon: Wallet },
                        { id: 'orders', label: 'Orders', icon: History },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id as 'profile' | 'wallet' | 'orders')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === id
                                ? 'bg-accent-pink text-white shadow-lg'
                                : 'text-text-secondary hover:text-text-primary hover:bg-glass-bg'
                                }`}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'profile' && (
                    /* Profile Tab */
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-text-primary">
                                Profile Information
                            </h2>
                            <Button
                                variant={isEditing ? 'secondary' : 'primary'}
                                size="sm"
                                onClick={() => {
                                    if (isEditing) {
                                        // Cancel editing
                                        setIsEditing(false);
                                        setProfileData({
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                        });
                                        setValidationErrors({});
                                    } else {
                                        setIsEditing(true);
                                    }
                                }}
                            >
                                {isEditing ? (
                                    <>
                                        <X size={16} className="mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit3 size={16} className="mr-2" />
                                        Edit
                                    </>
                                )}
                            </Button>
                        </div>

                        {isEditing ? (
                            /* Edit Mode */
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="First Name"
                                        name="firstName"
                                        value={profileData.firstName || ''}
                                        onChange={handleProfileChange}
                                        error={validationErrors.firstName}
                                        disabled={authLoading}
                                        required
                                    />
                                    <Input
                                        label="Last Name"
                                        name="lastName"
                                        value={profileData.lastName || ''}
                                        onChange={handleProfileChange}
                                        error={validationErrors.lastName}
                                        disabled={authLoading}
                                        required
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        isLoading={authLoading}
                                        disabled={authLoading}
                                    >
                                        <Save size={16} className="mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            /* View Mode */
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            First Name
                                        </label>
                                        <p className="text-text-primary font-medium">{user.firstName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Last Name
                                        </label>
                                        <p className="text-text-primary font-medium">{user.lastName}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Email Address
                                    </label>
                                    <p className="text-text-primary font-medium">{user.email}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Member Since
                                        </label>
                                        <p className="text-text-primary font-medium">
                                            {formatDate(user.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Account Status
                                        </label>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {user.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                )}

                {activeTab === 'wallet' && (
                    /* Wallet Tab */
                    <div className="space-y-6">
                        {/* Wallet Balance Card */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-text-primary">
                                    Wallet Balance
                                </h2>
                                <Button
                                    onClick={() => setShowTopUpModal(true)}
                                    size="sm"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Top Up
                                </Button>
                            </div>

                            <div className="text-center py-6">
                                <div className="text-4xl font-bold text-accent-pink mb-2">
                                    {balance ? formatCurrency(balance.balance) : '₹0.00'}
                                </div>
                                <p className="text-text-secondary">Available Balance</p>
                            </div>
                        </Card>

                        {/* Transaction History */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">
                                Transaction History
                            </h3>

                            {walletLoading ? (
                                <div className="flex justify-center py-8">
                                    <LoadingSpinner />
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-8">
                                    <CreditCard size={48} className="mx-auto text-text-secondary mb-4" />
                                    <p className="text-text-secondary">No transactions yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {transactions.slice(0, 10).map((transaction: WalletTransaction) => (
                                        <div
                                            key={transaction.transactionId}
                                            className="flex items-center justify-between p-3 glass-bg rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getTransactionIcon(transaction)}
                                                <div>
                                                    <p className="font-medium text-text-primary">
                                                        {transaction.description}
                                                    </p>
                                                    <p className="text-sm text-text-secondary">
                                                        {formatDate(transaction.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-semibold ${getTransactionColor(transaction)}`}>
                                                    {transaction.type === 'ORDER_PAYMENT' ? '-' : '+'}
                                                    {formatCurrency(transaction.amount)}
                                                </p>
                                                <p className="text-sm text-text-secondary">
                                                    Balance: {formatCurrency(transaction.balanceAfter)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {activeTab === 'orders' && (
                    /* Orders Tab */
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-text-primary mb-6">
                            Order History
                        </h2>

                        {/* Placeholder for order history */}
                        <div className="text-center py-12">
                            <History size={48} className="mx-auto text-text-secondary mb-4" />
                            <h3 className="text-lg font-medium text-text-primary mb-2">
                                Order History Coming Soon
                            </h3>
                            <p className="text-text-secondary">
                                Your order history will be displayed here once you make your first purchase.
                            </p>
                        </div>
                    </Card>
                )}
            </motion.div>

            {/* Top Up Modal */}
            {showTopUpModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-bg-secondary border border-glass-border rounded-lg p-6 w-full max-w-md"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-text-primary">
                                Top Up Wallet
                            </h3>
                            <button
                                onClick={() => setShowTopUpModal(false)}
                                className="p-1 hover:bg-glass-bg rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Amount"
                                type="number"
                                value={topUpAmount}
                                onChange={(e) => setTopUpAmount(e.target.value)}
                                placeholder="Enter amount (₹10 - ₹50,000)"
                                min="10"
                                max="50000"
                                step="10"
                            />

                            <div className="flex gap-2">
                                {[100, 500, 1000, 2000].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setTopUpAmount(amount.toString())}
                                        className="flex-1 py-2 text-sm bg-glass-bg hover:bg-glass-border rounded transition-colors"
                                    >
                                        ₹{amount}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleTopUp}
                                    isLoading={walletLoading}
                                    disabled={walletLoading || !topUpAmount}
                                    className="flex-1"
                                >
                                    Top Up Wallet
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowTopUpModal(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Profile; 