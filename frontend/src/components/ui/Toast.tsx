import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import type { ToastData } from '../../hooks/useToast';

/**
 * Toast Component Props
 */
interface ToastProps {
    toast: ToastData;
    onClose: (id: string) => void;
}

/**
 * Toast Container Props
 */
interface ToastContainerProps {
    toasts: ToastData[];
    onClose: (id: string) => void;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

/**
 * Individual Toast Component
 * 
 * Displays a single toast notification with appropriate styling and animations.
 */
const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Auto-dismiss toast after duration
    useEffect(() => {
        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose(toast.id), 300); // Wait for exit animation
            }, toast.duration);

            return () => clearTimeout(timer);
        }
    }, [toast.duration, toast.id, onClose]);

    // Get icon based on toast type
    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle size={20} className="text-green-400" />;
            case 'error':
                return <XCircle size={20} className="text-red-400" />;
            case 'warning':
                return <AlertCircle size={20} className="text-yellow-400" />;
            case 'info':
                return <Info size={20} className="text-blue-400" />;
            default:
                return <Info size={20} className="text-blue-400" />;
        }
    };

    // Get border color based on toast type
    const getBorderColor = () => {
        switch (toast.type) {
            case 'success':
                return 'border-green-400/20';
            case 'error':
                return 'border-red-400/20';
            case 'warning':
                return 'border-yellow-400/20';
            case 'info':
                return 'border-blue-400/20';
            default:
                return 'border-blue-400/20';
        }
    };

    // Get background color based on toast type
    const getBackgroundColor = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-500/10';
            case 'error':
                return 'bg-red-500/10';
            case 'warning':
                return 'bg-yellow-500/10';
            case 'info':
                return 'bg-blue-500/10';
            default:
                return 'bg-blue-500/10';
        }
    };

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`
        glass-card border ${getBorderColor()} ${getBackgroundColor()}
        p-4 rounded-lg shadow-lg backdrop-blur-md
        max-w-sm w-full pointer-events-auto
      `}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                    {getIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-text-primary mb-1">
                        {toast.title}
                    </h4>
                    {toast.message && (
                        <p className="text-sm text-text-secondary">
                            {toast.message}
                        </p>
                    )}

                    {/* Action Button */}
                    {toast.action && (
                        <button
                            onClick={toast.action.onClick}
                            className="mt-2 text-sm font-medium text-accent-pink hover:text-accent-orange transition-colors"
                        >
                            {toast.action.label}
                        </button>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={() => onClose(toast.id)}
                    className="flex-shrink-0 p-1 rounded-md hover:bg-glass-bg transition-colors"
                    aria-label="Close notification"
                >
                    <X size={16} className="text-text-secondary hover:text-text-primary" />
                </button>
            </div>
        </motion.div>
    );
};

/**
 * Toast Container Component
 * 
 * Manages and displays multiple toast notifications with proper positioning and animations.
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({
    toasts,
    onClose,
    position = 'top-right'
}) => {
    // Get position classes based on position prop
    const getPositionClasses = () => {
        switch (position) {
            case 'top-right':
                return 'top-4 right-4';
            case 'top-left':
                return 'top-4 left-4';
            case 'bottom-right':
                return 'bottom-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'top-center':
                return 'top-4 left-1/2 transform -translate-x-1/2';
            case 'bottom-center':
                return 'bottom-4 left-1/2 transform -translate-x-1/2';
            default:
                return 'top-4 right-4';
        }
    };

    return (
        <div
            className={`
        fixed z-50 pointer-events-none
        ${getPositionClasses()}
      `}
        >
            <div className="flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            toast={toast}
                            onClose={onClose}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}; 