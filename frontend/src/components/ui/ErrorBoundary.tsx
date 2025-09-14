import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

/**
 * Error Boundary Props
 */
interface ErrorBoundaryProps {
    /** Child components to wrap */
    children: ReactNode;
    /** Custom fallback component */
    fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
    /** Callback when error occurs */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    /** Show detailed error information (development only) */
    showDetails?: boolean;
}

/**
 * Error Boundary State
 */
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 * 
 * A production-ready error boundary that catches JavaScript errors anywhere in the child
 * component tree, logs those errors, and displays a fallback UI instead of the component
 * tree that crashed.
 * 
 * Features:
 * - Catches and handles React component errors
 * - Provides user-friendly error messages
 * - Offers recovery options (retry, go home)
 * - Logs errors for debugging
 * - Customizable fallback UI
 * - Development vs production error display
 * - Smooth animations with Framer Motion
 * - Accessible error reporting
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    /**
     * Static method to update state when an error is caught
     */
    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return {
            hasError: true,
            error
        };
    }

    /**
     * Lifecycle method called when an error is caught
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Update state with error info
        this.setState({
            errorInfo
        });

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // In production, you might want to send this to an error reporting service
        if (process.env.NODE_ENV === 'production') {
            // TODO: Send error to monitoring service (e.g., Sentry, LogRocket)
            this.reportError(error, errorInfo);
        }
    }

    /**
     * Report error to monitoring service
     */
    private reportError(error: Error, errorInfo: ErrorInfo) {
        // Example error reporting - replace with your preferred service
        try {
            // Send to error monitoring service
            console.log('Reporting error to monitoring service:', {
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        } catch (reportingError) {
            console.error('Failed to report error:', reportingError);
        }
    }

    /**
     * Reset error boundary state
     */
    private handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    /**
     * Navigate to home page
     */
    private handleGoHome = () => {
        window.location.href = '/';
    };

    /**
     * Reload the current page
     */
    private handleReload = () => {
        window.location.reload();
    };

    render() {
        const { hasError, error, errorInfo } = this.state;
        const { children, fallback, showDetails = process.env.NODE_ENV === 'development' } = this.props;

        if (hasError && error) {
            // Use custom fallback if provided
            if (fallback) {
                return fallback(error, errorInfo || null);
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-bg-primary">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md w-full"
                    >
                        <div className="glass-card p-8 text-center">
                            {/* Error Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <AlertTriangle size={32} className="text-red-400" />
                            </motion.div>

                            {/* Error Message */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h1 className="text-2xl font-bold text-text-primary mb-2">
                                    Oops! Something went wrong
                                </h1>
                                <p className="text-text-secondary mb-6">
                                    We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
                                </p>
                            </motion.div>

                            {/* Error Details (Development Only) */}
                            {showDetails && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ delay: 0.4 }}
                                    className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg text-left"
                                >
                                    <h3 className="text-sm font-semibold text-red-400 mb-2">
                                        Error Details (Development Mode)
                                    </h3>
                                    <div className="text-xs text-red-300 font-mono space-y-2">
                                        <div>
                                            <strong>Message:</strong> {error.message}
                                        </div>
                                        {error.stack && (
                                            <div>
                                                <strong>Stack:</strong>
                                                <pre className="mt-1 whitespace-pre-wrap text-xs">
                                                    {error.stack}
                                                </pre>
                                            </div>
                                        )}
                                        {errorInfo?.componentStack && (
                                            <div>
                                                <strong>Component Stack:</strong>
                                                <pre className="mt-1 whitespace-pre-wrap text-xs">
                                                    {errorInfo.componentStack}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-3"
                            >
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        onClick={this.handleReset}
                                        className="flex-1"
                                        variant="primary"
                                    >
                                        <RefreshCw size={16} className="mr-2" />
                                        Try Again
                                    </Button>
                                    <Button
                                        onClick={this.handleGoHome}
                                        className="flex-1"
                                        variant="secondary"
                                    >
                                        <Home size={16} className="mr-2" />
                                        Go Home
                                    </Button>
                                </div>

                                <Button
                                    onClick={this.handleReload}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    Reload Page
                                </Button>
                            </motion.div>

                            {/* Support Information */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-6 pt-6 border-t border-glass-border"
                            >
                                <p className="text-xs text-text-secondary">
                                    If this problem continues, please contact our support team with the error details above.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return children;
    }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
} 