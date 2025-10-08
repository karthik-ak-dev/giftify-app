import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Voucher } from '../types';
import { useStore } from '../store/useStore';

interface VoucherCardProps {
    voucher: Voucher;
}

const VoucherCard = ({ voucher }: VoucherCardProps) => {
    const { openModal } = useStore();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="card group cursor-pointer"
            onClick={() => openModal(voucher)}
        >
            {/* Icon/Logo */}
            <div className="relative">
                <div
                    className={`w-full h-32 bg-gradient-to-br ${voucher.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}
                >
                    <span className="text-6xl">{voucher.icon}</span>
                </div>
                <div className="absolute top-2 right-2 bg-dark-900/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-dark-300 border border-white/10">
                    {voucher.category}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{voucher.name}</h3>
                <p className="text-sm text-dark-300 line-clamp-2">{voucher.description}</p>

                {/* Variants Preview */}
                <div className="flex flex-wrap gap-1 pt-2">
                    {voucher.variants.slice(0, 3).map((variant) => (
                        <span
                            key={variant.id}
                            className="text-xs px-2 py-1 rounded-lg bg-white/5 text-dark-300 border border-white/10"
                        >
                            ₹{variant.denomination}
                        </span>
                    ))}
                    {voucher.variants.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-white/5 text-dark-300 border border-white/10">
                            +{voucher.variants.length - 3} more
                        </span>
                    )}
                </div>
            </div>

            {/* Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 btn-primary flex items-center justify-center gap-2"
                onClick={(e) => {
                    e.stopPropagation();
                    openModal(voucher);
                }}
            >
                <Eye className="w-4 h-4" />
                View Variants
            </motion.button>
        </motion.div>
    );
};

export default VoucherCard;

