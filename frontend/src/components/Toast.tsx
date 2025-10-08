import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const Toast = () => {
    const { toasts, removeToast } = useStore();

    const getIcon = (type: 'success' | 'error' | 'info') => {
        switch (type) {
            case 'success':
                return <CheckCircle2 className="w-5 h-5 text-green-400" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-400" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    const getColor = (type: 'success' | 'error' | 'info') => {
        switch (type) {
            case 'success':
                return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
            case 'error':
                return 'from-red-500/20 to-rose-500/20 border-red-500/30';
            case 'info':
                return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.8 }}
                        className={`flex items-center gap-3 bg-gradient-to-r ${getColor(
                            toast.type
                        )} backdrop-blur-xl border rounded-xl px-4 py-3 shadow-2xl min-w-[300px] max-w-md`}
                    >
                        {getIcon(toast.type)}
                        <p className="flex-1 text-sm font-medium text-white">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Toast;

