import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, Calendar, CreditCard } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate } from '../utils/formatters';

const OrderHistory = () => {
    const { orders, loadOrders } = useStore();
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const toggleOrder = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Package className="w-8 h-8 text-primary-400" />
                        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                            Order History
                        </h1>
                    </div>
                    <p className="text-lg text-dark-300">
                        View all your past orders and purchases
                    </p>
                </motion.div>

                {/* Orders List */}
                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass rounded-2xl overflow-hidden"
                            >
                                {/* Order Summary */}
                                <div
                                    className="p-6 cursor-pointer hover:bg-white/5 transition-all"
                                    onClick={() => toggleOrder(order.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-bold text-white">
                                                    Order #{order.id.slice(-8).toUpperCase()}
                                                </h3>
                                                <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-dark-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(order.date)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Package className="w-4 h-4" />
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CreditCard className="w-4 h-4" />
                                                    {formatCurrency(order.total)}
                                                </div>
                                            </div>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: expandedOrderId === order.id ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="p-2 rounded-lg glass"
                                        >
                                            {expandedOrderId === order.id ? (
                                                <ChevronUp className="w-5 h-5 text-primary-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-dark-400" />
                                            )}
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <AnimatePresence>
                                    {expandedOrderId === order.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-white/10"
                                        >
                                            <div className="p-6 space-y-3">
                                                <h4 className="font-semibold text-white mb-3">Order Items</h4>
                                                {order.items.map((item, itemIndex) => (
                                                    <motion.div
                                                        key={`${item.voucherId}-${item.variantId}`}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: itemIndex * 0.05 }}
                                                        className="flex items-center justify-between p-4 rounded-xl glass"
                                                    >
                                                        <div className="flex-1">
                                                            <h5 className="font-medium text-white">{item.voucherName}</h5>
                                                            <p className="text-sm text-dark-400">
                                                                {formatCurrency(item.denomination)} Voucher × {item.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="font-semibold text-primary-400">
                                                            {formatCurrency(item.price * item.quantity)}
                                                        </p>
                                                    </motion.div>
                                                ))}

                                                {/* Total */}
                                                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                                    <span className="text-lg font-semibold text-white">Total</span>
                                                    <span className="text-2xl font-bold text-primary-400">
                                                        {formatCurrency(order.total)}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-xl font-medium text-white mb-2">No orders yet</p>
                        <p className="text-dark-400 mb-6">
                            Start shopping to see your order history here
                        </p>
                        <motion.a
                            href="/"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block btn-primary"
                        >
                            Browse Vouchers
                        </motion.a>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;

