import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const cardVariants = {
    default: 'bg-bg-card border border-glass-border',
    glass: 'glass-card',
    elevated: 'bg-bg-card border border-glass-border shadow-lg',
};

const cardPadding = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
    variant = 'glass',
    padding = 'md',
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn(
                'rounded-2xl transition-all duration-300 animate-fade-in',
                cardVariants[variant],
                cardPadding[padding],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}; 