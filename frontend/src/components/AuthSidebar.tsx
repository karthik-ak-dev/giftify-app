import { X, Mail, Lock, User as UserIcon, Sparkles, AlertCircle, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { validateRegistrationForm, validateLoginForm, hasFieldError } from '../utils/validation'

const AuthSidebar = () => {
    const { isAuthSidebarOpen, closeAuthSidebar, login, register, isLoading, error, clearError } = useAuth()
    const [isSignUp, setIsSignUp] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    })
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // Get current form validation
    const currentValidation = isSignUp
        ? validateRegistrationForm(formData)
        : validateLoginForm(formData)

    // Helper to get field CSS classes
    const getFieldClass = (fieldName: string, value: string) => {
        const hasError = hasFieldError(fieldName, value, isSignUp)
        return hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500'
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()

        // Validate form
        if (!currentValidation.isValid) {
            setValidationErrors(currentValidation.errors)
            return
        }

        // Clear validation errors
        setValidationErrors([])

        try {
            if (isSignUp) {
                await register(formData.email, formData.password, formData.firstName, formData.lastName)
            } else {
                await login(formData.email, formData.password)
            }

            // Auth was successful - sidebar will close via AuthContext
            // Reset form state for next time
            setFormData({ email: '', password: '', firstName: '', lastName: '' })
            setShowPassword(false)
            setShowPasswordRequirements(false)
            setValidationErrors([])
        } catch (error) {
            console.error('Auth error:', error)
            // Error is already set in AuthContext
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))

        // Clear validation errors when user starts typing
        if (validationErrors.length > 0) {
            setValidationErrors([])
        }

        // Show password requirements for signup
        if (e.target.name === 'password' && isSignUp) {
            setShowPasswordRequirements(true)
        }
    }

    const toggleMode = () => {
        setIsSignUp(!isSignUp)
        clearError()
        setValidationErrors([])
        setShowPasswordRequirements(false)
        setShowPassword(false)
        // Reset form when switching
        setFormData({
            email: '',
            password: '',
            firstName: '',
            lastName: ''
        })
    }

    if (!isAuthSidebarOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
                onClick={closeAuthSidebar}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-elegant-2xl z-50 flex flex-col animate-slide-down">
                {/* Header */}
                <div className="relative p-8 bg-gradient-to-br from-primary-50 via-white to-accent-50 border-b border-neutral-200">
                    <button
                        onClick={closeAuthSidebar}
                        className="absolute top-4 right-4 w-10 h-10 rounded-xl hover:bg-neutral-100 flex items-center justify-center transition-all elegant-button"
                    >
                        <X className="w-5 h-5 text-neutral-600" />
                    </button>

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-elegant-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-neutral-900">
                                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                                </h2>
                            </div>
                        </div>
                        <p className="text-neutral-600 text-sm ml-15">
                            {isSignUp
                                ? 'Start your gifting journey with Giftify'
                                : 'Login to continue your shopping experience'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    {/* Backend Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-scale-in">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-red-700 font-medium">
                                    {error}
                                </p>
                            </div>
                            <button
                                onClick={clearError}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Validation Errors - Only show on submit attempt */}
                    {validationErrors.length > 0 && (
                        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl animate-scale-in">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-orange-700 font-medium mb-2">
                                        Please fix the following issues:
                                    </p>
                                    <ul className="space-y-1">
                                        {validationErrors.map((error, index) => (
                                            <li key={index} className="text-xs text-orange-600 flex items-start gap-2">
                                                <span className="text-orange-500 mt-0.5">•</span>
                                                {error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isSignUp && (
                            <>
                                {/* Name Row - First and Last Name */}
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                placeholder="John"
                                                className={`w-full pl-11 pr-3 py-3 bg-white border-2 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all ${getFieldClass('firstName', formData.firstName)}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Doe"
                                            className={`w-full px-3 py-3 bg-white border-2 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all ${getFieldClass('lastName', formData.lastName)}`}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    className={`w-full pl-11 pr-4 py-3 bg-white border-2 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all ${getFieldClass('email', formData.email)}`}
                                />
                            </div>
                            {hasFieldError('email', formData.email) && (
                                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Please enter a valid email address
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-neutral-700">
                                    Password
                                </label>
                                {!isSignUp && (
                                    <button
                                        type="button"
                                        className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className={`w-full pl-11 pr-11 py-3 bg-white border-2 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all ${getFieldClass('password', formData.password)}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {hasFieldError('password', formData.password) && (
                                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Password must be at least 8 characters long
                                </p>
                            )}
                            {isSignUp && showPasswordRequirements && (
                                <div className="mt-3 p-4 bg-primary-50 border border-primary-200 rounded-xl">
                                    <p className="text-xs text-primary-700 font-medium mb-3">Password Requirements:</p>
                                    <div className="space-y-2">
                                        {(() => {
                                            const requirements = [
                                                { text: 'At least 8 characters long', met: formData.password.length >= 8 },
                                                { text: 'At least one uppercase letter', met: /[A-Z]/.test(formData.password) },
                                                { text: 'At least one lowercase letter', met: /[a-z]/.test(formData.password) },
                                                { text: 'At least one number', met: /\d/.test(formData.password) },
                                                { text: 'At least one special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) }
                                            ];

                                            return requirements.map((req, index) => (
                                                <div key={index} className="flex items-center gap-2 text-xs">
                                                    {req.met ? (
                                                        <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" />
                                                    ) : (
                                                        <div className="w-4 h-4 border-2 border-neutral-300 rounded-full flex-shrink-0" />
                                                    )}
                                                    <span className={req.met ? 'text-success-600 font-medium' : 'text-neutral-600'}>
                                                        {req.text}
                                                    </span>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !currentValidation.isValid}
                            className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-bold text-base elegant-button shadow-elegant-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {isLoading
                                ? (isSignUp ? 'Creating Account...' : 'Logging in...')
                                : (isSignUp ? 'Create Account' : 'Login')
                            }
                        </button>
                    </form>
                </div>

                {/* Footer - Toggle between Login/Signup */}
                <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                    <div className="text-center">
                        <p className="text-neutral-600 text-sm">
                            {isSignUp ? (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        onClick={toggleMode}
                                        className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                                    >
                                        Login
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{' '}
                                    <button
                                        onClick={toggleMode}
                                        className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                                    >
                                        Sign up
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthSidebar
