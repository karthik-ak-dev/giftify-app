import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

const buttonVariants = {
    primary: 'gradient-button',
    secondary: 'bg-bg-secondary text-text-primary border border-glass-border hover:border-accent-pink',
    ghost: 'bg-transparent text-text-primary hover:bg-glass-bg',
    glass: 'glass-button',
};

const buttonSizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    className,
    children,
    ...props
}) => {
    return (
        <button
            className={cn(
                'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95',
                buttonVariants[variant],
                buttonSizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            <span className={cn('flex items-center gap-2', isLoading && 'opacity-0')}>
                {children}
            </span>
        </button>
    );
}; 