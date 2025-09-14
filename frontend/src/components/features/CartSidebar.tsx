import React from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';

const CartSidebar: React.FC = () => {
    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                            <ShoppingBag size={24} />
                            Your Cart
                        </h2>
                        <button className="p-2 hover:bg-glass-bg rounded-lg transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-24 h-24 bg-glass-bg rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag size={32} className="text-text-secondary" />
                        </div>
                        <h3 className="text-lg font-medium text-text-primary mb-2">
                            Your cart is empty
                        </h3>
                        <p className="text-text-secondary text-center mb-6">
                            Add some amazing gift cards to get started!
                        </p>
                        <Button variant="primary">
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default CartSidebar; 