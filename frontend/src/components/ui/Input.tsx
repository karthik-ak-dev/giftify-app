import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}) => {
    const baseClasses = 'w-full px-4 py-3 bg-glass-bg border border-glass-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-pink focus:border-transparent transition-all duration-200';
    const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
    const paddingClasses = leftIcon ? 'pl-12' : rightIcon ? 'pr-12' : '';

    const inputClasses = `${baseClasses} ${errorClasses} ${paddingClasses} ${className}`;

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-text-primary">
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                        {leftIcon}
                    </div>
                )}

                <input
                    className={inputClasses}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}; 