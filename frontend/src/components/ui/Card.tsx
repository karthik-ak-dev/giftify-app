import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    ...props
}) => {
    const baseClasses = 'glass-card p-6 rounded-lg border border-glass-border bg-glass-bg backdrop-blur-sm';
    const classes = `${baseClasses} ${className}`;

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
}; 