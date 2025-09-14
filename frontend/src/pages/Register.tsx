import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

// Components
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Hooks and Stores
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

// Types
import type { RegisterData } from '../types/auth';

// Utils
import { validateEmail, validatePassword, validateName } from '../utils/validators';

/**
 * Register Page Component
 * 
 * Handles user registration with:
 * - Form validation with real-time feedback
 * - Password strength indicator
 * - Error handling and success states
 * - Automatic redirect after successful registration
 */
const Register: React.FC = () => {
    // ===== HOOKS & STATE =====
    const navigate = useNavigate();
    const { register } = useAuth();
    const { isLoading, error: authError, isAuthenticated } = useAuthStore();

    // Form state
    const [formData, setFormData] = useState<RegisterData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<RegisterData>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof RegisterData, boolean>>>({});
    const [passwordStrength, setPasswordStrength] = useState<{
        score: number;
        feedback: string[];
    }>({ score: 0, feedback: [] });

    // ===== LIFECYCLE EFFECTS =====

    /**
     * Redirect if already authenticated
     */
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    /**
     * Update password strength when password changes
     */
    useEffect(() => {
        if (formData.password) {
            const strength = calculatePasswordStrength(formData.password);
            setPasswordStrength(strength);
        } else {
            setPasswordStrength({ score: 0, feedback: [] });
        }
    }, [formData.password]);

    // ===== VALIDATION =====

    /**
     * Calculate password strength score and feedback
     */
    const calculatePasswordStrength = (password: string): { score: number; feedback: string[] } => {
        let score = 0;
        const feedback: string[] = [];

        if (password.length >= 8) {
            score += 1;
        } else {
            feedback.push('At least 8 characters');
        }

        if (/[A-Z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('One uppercase letter');
        }

        if (/[a-z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('One lowercase letter');
        }

        if (/\d/.test(password)) {
            score += 1;
        } else {
            feedback.push('One number');
        }

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            score += 1;
        } else {
            feedback.push('One special character');
        }

        return { score, feedback };
    };

    /**
     * Validate individual form field
     */
    const validateField = (name: keyof RegisterData, value: string): string => {
        switch (name) {
            case 'firstName':
                if (!value.trim()) return 'First name is required';
                if (!validateName(value)) return 'Please enter a valid first name';
                return '';

            case 'lastName':
                if (!value.trim()) return 'Last name is required';
                if (!validateName(value)) return 'Please enter a valid last name';
                return '';

            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!validateEmail(value)) return 'Please enter a valid email address';
                return '';

            case 'password':
                if (!value) return 'Password is required';
                if (!validatePassword(value)) return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
                return '';

            default:
                return '';
        }
    };

    /**
     * Validate entire form
     */
    const validateForm = (): boolean => {
        const newErrors: Partial<RegisterData> = {};

        Object.keys(formData).forEach((key) => {
            const fieldName = key as keyof RegisterData;
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
        const fieldName = name as keyof RegisterData;

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
        const fieldName = e.target.name as keyof RegisterData;

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
            firstName: true,
            lastName: true,
            email: true,
            password: true,
        });

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Check password strength
        if (passwordStrength.score < 4) {
            setErrors(prev => ({
                ...prev,
                password: 'Please create a stronger password'
            }));
            return;
        }

        // Attempt registration
        try {
            await register(formData);
            // Navigation will be handled by the useEffect hook
        } catch (error) {
            // Error is handled by the auth store and displayed below
            console.error('Registration failed:', error);
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
    const getFieldError = (fieldName: keyof RegisterData): string => {
        return touched[fieldName] ? errors[fieldName] || '' : '';
    };

    /**
     * Check if form is valid and ready to submit
     */
    const isFormValid = (): boolean => {
        return Object.values(formData).every((value: string) => value.trim() !== '') &&
            Object.values(errors).every(error => !error) &&
            passwordStrength.score >= 4;
    };

    /**
     * Render password strength indicator
     */
    const renderPasswordStrength = () => {
        if (!formData.password) return null;

        const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
        const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

        return (
            <div className="mt-2">
                <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 flex-1 rounded ${index < passwordStrength.score
                                ? strengthColors[passwordStrength.score - 1]
                                : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary">
                        {passwordStrength.score > 0 ? strengthLabels[passwordStrength.score - 1] : 'Enter password'}
                    </span>
                    {passwordStrength.feedback.length > 0 && (
                        <span className="text-text-secondary">
                            Missing: {passwordStrength.feedback.join(', ')}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    // ===== MAIN RENDER =====
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
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
                            Create Account
                        </motion.h1>
                        <motion.p
                            className="text-text-secondary"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Join Giftify and start gifting today
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

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Input
                                    label="First Name"
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="First name"
                                    leftIcon={<User size={20} />}
                                    error={getFieldError('firstName')}
                                    required
                                    autoComplete="given-name"
                                    disabled={isLoading}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Input
                                    label="Last Name"
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Last name"
                                    leftIcon={<User size={20} />}
                                    error={getFieldError('lastName')}
                                    required
                                    autoComplete="family-name"
                                    disabled={isLoading}
                                />
                            </motion.div>
                        </div>

                        {/* Email Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
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
                            transition={{ delay: 0.6 }}
                        >
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Create a strong password"
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
                                autoComplete="new-password"
                                disabled={isLoading}
                            />
                            {renderPasswordStrength()}
                        </motion.div>

                        {/* Terms and Conditions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-xs text-text-secondary"
                        >
                            By creating an account, you agree to our{' '}
                            <Link to="/terms" className="text-accent-pink hover:text-accent-orange transition-colors">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-accent-pink hover:text-accent-orange transition-colors">
                                Privacy Policy
                            </Link>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
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
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} className="mr-2" />
                                        Create Account
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    {/* Footer Links */}
                    <motion.div
                        className="mt-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <p className="text-text-secondary text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-accent-pink hover:text-accent-orange transition-colors font-medium"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register; 