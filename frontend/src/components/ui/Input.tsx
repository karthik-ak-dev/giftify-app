import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className,
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-text-primary mb-2"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                        {leftIcon}
                    </div>
                )}

                <input
                    id={inputId}
                    className={cn(
                        'w-full px-4 py-3 bg-glass-bg backdrop-blur-glass border border-glass-border rounded-xl text-text-primary placeholder-text-secondary transition-all duration-300 focus-ring',
                        'hover:border-accent-pink focus:border-primary-purple',
                        leftIcon && 'pl-10',
                        rightIcon && 'pr-10',
                        error && 'border-red-500 focus:border-red-500',
                        className
                    )}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-400">
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p className="mt-1 text-sm text-text-secondary">
                    {helperText}
                </p>
            )}
        </div>
    );
}; 