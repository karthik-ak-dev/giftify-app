import React from 'react';
import { motion } from 'framer-motion';

/**
 * LoadingSpinner Component Props
 */
export interface LoadingSpinnerProps {
    /** Size of the spinner */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Custom color for the spinner */
    color?: string;
    /** Additional CSS classes */
    className?: string;
    /** Loading text to display below spinner */
    text?: string;
}

/**
 * LoadingSpinner Component
 * 
 * A customizable loading spinner with multiple sizes and smooth animations.
 * Uses Framer Motion for smooth rotation and optional pulsing effects.
 * 
 * Features:
 * - Multiple size variants (sm, md, lg, xl)
 * - Customizable colors
 * - Optional loading text
 * - Smooth animations with Framer Motion
 * - Accessible with proper ARIA attributes
 * - Glassmorphism design integration
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color,
    className = '',
    text
}) => {
    // Size mappings for different spinner sizes
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };

    // Text size mappings
    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg'
    };

    return (
        <div
            className={`flex flex-col items-center justify-center ${className}`}
            role="status"
            aria-label={text || 'Loading'}
        >
            {/* Spinner Circle */}
            <motion.div
                className={`
          ${sizeClasses[size]} 
          border-2 border-glass-border border-t-accent-pink rounded-full
          ${color ? '' : 'border-t-accent-pink'}
        `}
                style={color ? { borderTopColor: color } : {}}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear'
                }}
                aria-hidden="true"
            />

            {/* Optional Loading Text */}
            {text && (
                <motion.p
                    className={`
            mt-2 text-text-secondary font-medium
            ${textSizeClasses[size]}
          `}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {text}
                </motion.p>
            )}

            {/* Screen Reader Text */}
            <span className="sr-only">
                {text || 'Loading, please wait...'}
            </span>
        </div>
    );
}; 