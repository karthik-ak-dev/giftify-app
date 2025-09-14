import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

// Components
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Hooks and Stores
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

// Types
import type { LoginCredentials } from '../types/auth';

// Utils
import { validateEmail, validatePassword } from '../utils/validators';

/**
 * Login Page Component
 * 
 * Handles user authentication with:
 * - Form validation
 * - Error handling
 * - Loading states
 * - Automatic redirect after successful login
 */
const Login: React.FC = () => {
    // ===== HOOKS & STATE =====
    const navigate = useNavigate();
    const { login } = useAuth();
    const { isLoading, error: authError, isAuthenticated } = useAuthStore();

    // Form state
    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: '',
    });

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof LoginCredentials, boolean>>>({});

    // ===== LIFECYCLE EFFECTS =====

    /**
     * Redirect if already authenticated
     */
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // ===== VALIDATION =====

    /**
     * Validate individual form field
     */
    const validateField = (name: keyof LoginCredentials, value: string): string => {
        switch (name) {
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!validateEmail(value)) return 'Please enter a valid email address';
                return '';

            case 'password':
                if (!value) return 'Password is required';
                if (!validatePassword(value)) return 'Password must be at least 8 characters';
                return '';

            default:
                return '';
        }
    };

    /**
     * Validate entire form
     */
    const validateForm = (): boolean => {
        const newErrors: Partial<LoginCredentials> = {};

        Object.keys(formData).forEach((key) => {
            const fieldName = key as keyof LoginCredentials;
            const error = validateField(fieldName, formData[fieldName]);
            if (error) {
                newErrors[fieldName] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ===== EVENT HANDLERS =====

    /**
     * Handle form input changes with real-time validation
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof LoginCredentials;

        // Update form data
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));

        // Validate field if it has been touched
        if (touched[fieldName]) {
            const error = validateField(fieldName, value);
            setErrors((prev) => ({
                ...prev,
                [fieldName]: error,
            }));
        }
    };

    /**
     * Handle field blur (mark as touched and validate)
     */
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const fieldName = e.target.name as keyof LoginCredentials;

        setTouched((prev) => ({
            ...prev,
            [fieldName]: true,
        }));

        // Validate the field
        const error = validateField(fieldName, formData[fieldName]);
        setErrors((prev) => ({
            ...prev,
            [fieldName]: error,
        }));
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({
            email: true,
            password: true,
        });

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Attempt login
        try {
            await login(formData);
            // Navigation will be handled by the useEffect hook
        } catch (error) {
            // Error is handled by the auth store and displayed below
            console.error('Login failed:', error);
        }
    };

    /**
     * Toggle password visibility
     */
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    // ===== RENDER HELPERS =====

    /**
     * Get input error state
     */
    const getFieldError = (fieldName: keyof LoginCredentials): string => {
        return touched[fieldName] ? errors[fieldName] || '' : '';
    };

    /**
     * Check if form is valid and ready to submit
     */
    const isFormValid = (): boolean => {
        return Object.values(formData).every((value: string) => value.trim() !== '') &&
            Object.values(errors).every(error => !error);
    };

    // ===== MAIN RENDER =====
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h1
                            className="text-3xl font-bold neon-text mb-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Welcome Back
                        </motion.h1>
                        <motion.p
                            className="text-text-secondary"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Sign in to your Giftify account
                        </motion.p>
                    </div>

                    {/* Global Error Message */}
                    {authError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
                        >
                            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                            <p className="text-red-400 text-sm">{authError}</p>
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Email Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter your email"
                                leftIcon={<Mail size={20} />}
                                error={getFieldError('email')}
                                required
                                autoComplete="email"
                                disabled={isLoading}
                            />
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter your password"
                                leftIcon={<Lock size={20} />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="hover:text-text-primary transition-colors"
                                        disabled={isLoading}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                }
                                error={getFieldError('password')}
                                required
                                autoComplete="current-password"
                                disabled={isLoading}
                            />
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading || !isFormValid()}
                                variant="primary"
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    {/* Footer Links */}
                    <motion.div
                        className="mt-8 space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        {/* Forgot Password Link */}
                        <div className="text-center">
                            <Link
                                to="/forgot-password"
                                className="text-accent-pink hover:text-accent-orange transition-colors text-sm font-medium"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-text-secondary text-sm">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="text-accent-pink hover:text-accent-orange transition-colors font-medium"
                                >
                                    Create one now
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Demo Credentials (Development Only) */}
                {process.env.NODE_ENV === 'development' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-4 p-4 glass-card text-center"
                    >
                        <p className="text-xs text-text-secondary mb-2">Demo Credentials:</p>
                        <p className="text-xs text-text-secondary">
                            Email: demo@giftify.com | Password: Demo123!
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Login; 