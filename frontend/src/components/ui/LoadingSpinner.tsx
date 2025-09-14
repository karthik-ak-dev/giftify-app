import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className,
}) => {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={cn(
                'border-2 border-current border-t-transparent rounded-full',
                spinnerSizes[size],
                className
            )}
        />
    );
}; 