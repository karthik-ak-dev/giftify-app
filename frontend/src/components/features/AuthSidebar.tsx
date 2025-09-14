import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

// UI Components
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

// Hooks
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';

// Types
import type { LoginCredentials, RegisterData } from '../../types/auth';

// Utils
import { validateEmail, validatePassword, validateName } from '../../utils/validators';

interface AuthSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'login' | 'register';
}

/**
 * Authentication Sidebar Component
 * 
 * Seamless login/register experience in a side drawer
 * Takes 1/3 of screen width for better UX
 */
const AuthSidebar: React.FC<AuthSidebarProps> = ({
    isOpen,
    onClose,
    defaultMode = 'login'
}) => {
    const { login, register } = useAuth();
    const { isLoading, error: authError } = useAuthStore();

    // UI State
    const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [loginData, setLoginData] = useState<LoginCredentials>({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState<RegisterData>({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    // Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Handle backdrop click
    const handleBackdropClick = () => {
        onClose();
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'login') {
            // Validate login
            const newErrors: Record<string, string> = {};

            if (!loginData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!validateEmail(loginData.email)) {
                newErrors.email = 'Please enter a valid email';
            }

            if (!loginData.password) {
                newErrors.password = 'Password is required';
            }

            setErrors(newErrors);

            if (Object.keys(newErrors).length === 0) {
                try {
                    await login(loginData);
                    onClose();
                } catch (error) {
                    console.error('Login failed:', error);
                }
            }
        } else {
            // Validate register
            const newErrors: Record<string, string> = {};

            if (!registerData.firstName.trim()) {
                newErrors.firstName = 'First name is required';
            } else if (!validateName(registerData.firstName)) {
                newErrors.firstName = 'Please enter a valid first name';
            }

            if (!registerData.lastName.trim()) {
                newErrors.lastName = 'Last name is required';
            } else if (!validateName(registerData.lastName)) {
                newErrors.lastName = 'Please enter a valid last name';
            }

            if (!registerData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!validateEmail(registerData.email)) {
                newErrors.email = 'Please enter a valid email';
            }

            if (!registerData.password) {
                newErrors.password = 'Password is required';
            } else if (!validatePassword(registerData.password)) {
                newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
            }

            setErrors(newErrors);

            if (Object.keys(newErrors).length === 0) {
                try {
                    await register(registerData);
                    onClose();
                } catch (error) {
                    console.error('Registration failed:', error);
                }
            }
        }
    };

    // Handle input changes
    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Switch between login and register
    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setErrors({});
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleBackdropClick}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Sidebar - 1/3 screen width */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed right-0 top-0 h-full w-full max-w-md lg:max-w-lg bg-bg-secondary border-l border-glass-border z-50 overflow-y-auto"
                style={{ width: 'min(400px, 33.333vw)' }}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-glass-border">
                        <h2 className="text-2xl font-bold neon-text">
                            {mode === 'login' ? 'Welcome Back' : 'Join Giftify'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-glass-bg rounded-lg transition-colors"
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                        {/* Error Display */}
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

                        {/* Auth Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {mode === 'register' && (
                                <>
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="First Name"
                                            type="text"
                                            name="firstName"
                                            value={registerData.firstName}
                                            onChange={handleRegisterChange}
                                            placeholder="First name"
                                            leftIcon={<User size={20} />}
                                            error={errors.firstName}
                                            required
                                            disabled={isLoading}
                                        />
                                        <Input
                                            label="Last Name"
                                            type="text"
                                            name="lastName"
                                            value={registerData.lastName}
                                            onChange={handleRegisterChange}
                                            placeholder="Last name"
                                            leftIcon={<User size={20} />}
                                            error={errors.lastName}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Email Field */}
                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                value={mode === 'login' ? loginData.email : registerData.email}
                                onChange={mode === 'login' ? handleLoginChange : handleRegisterChange}
                                placeholder="Enter your email"
                                leftIcon={<Mail size={20} />}
                                error={errors.email}
                                required
                                disabled={isLoading}
                            />

                            {/* Password Field */}
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={mode === 'login' ? loginData.password : registerData.password}
                                onChange={mode === 'login' ? handleLoginChange : handleRegisterChange}
                                placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password'}
                                leftIcon={<Lock size={20} />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="hover:text-text-primary transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                }
                                error={errors.password}
                                required
                                disabled={isLoading}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                                isLoading={isLoading}
                                variant="primary"
                            >
                                {mode === 'login' ? 'Sign In' : 'Create Account'}
                            </Button>
                        </form>

                        {/* Switch Mode */}
                        <div className="mt-8 text-center">
                            <p className="text-text-secondary text-sm">
                                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                                {' '}
                                <button
                                    type="button"
                                    onClick={switchMode}
                                    className="text-accent-pink hover:text-accent-orange transition-colors font-medium"
                                    disabled={isLoading}
                                >
                                    {mode === 'login' ? 'Create one now' : 'Sign in here'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default AuthSidebar; 