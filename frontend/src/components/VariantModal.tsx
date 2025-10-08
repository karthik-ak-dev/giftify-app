import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/formatters';

const VariantModal = () => {
    const { selectedVoucher, isModalOpen, closeModal, addToCart } = useStore();

    if (!selectedVoucher) return null;

    return (
        <AnimatePresence>
            {isModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-dark rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className={`bg-gradient-to-r ${selectedVoucher.color} p-6 relative`}>
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>

                                <div className="flex items-center gap-4">
                                    <div className="text-6xl">{selectedVoucher.icon}</div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            {selectedVoucher.name}
                                        </h2>
                                        <p className="text-white/80">{selectedVoucher.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Variants */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Select Denomination
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {selectedVoucher.variants.map((variant) => (
                                        <motion.div
                                            key={variant.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="glass rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:border-primary-500 border-2 border-transparent transition-all"
                                            onClick={() => {
                                                addToCart({
                                                    voucherId: selectedVoucher.id,
                                                    variantId: variant.id,
                                                    voucherName: selectedVoucher.name,
                                                    denomination: variant.denomination,
                                                    price: variant.price,
                                                });
                                            }}
                                        >
                                            <div>
                                                <p className="text-2xl font-bold text-white">
                                                    {formatCurrency(variant.denomination)}
                                                </p>
                                                <p className="text-sm text-dark-400">
                                                    Pay {formatCurrency(variant.price)}
                                                </p>
                                            </div>
                                            <motion.button
                                                whileHover={{ rotate: 90 }}
                                                className="p-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg group-hover:shadow-primary-500/50 transition-all"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default VariantModal;

