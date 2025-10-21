import { X, Mail, Lock, User as UserIcon, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const AuthSidebar = () => {
    const { isAuthSidebarOpen, closeAuthSidebar, login, register, isLoading, error, clearError } = useAuth()
    const [isSignUp, setIsSignUp] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (isSignUp) {
                await register(formData.email, formData.password, formData.firstName, formData.lastName)
            } else {
                await login(formData.email, formData.password)
            }

            // Reset form on success
            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: ''
            })
        } catch (error) {
            // Error is handled by AuthContext
            console.error('Auth error:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const toggleMode = () => {
        setIsSignUp(!isSignUp)
        clearError()
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
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                onClick={closeAuthSidebar}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-50 shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="relative p-8 border-b border-white/10">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 via-transparent to-transparent opacity-50" />

                    <button
                        onClick={closeAuthSidebar}
                        className="absolute top-4 right-4 w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-colors z-10"
                    >
                        <X className="w-6 h-6 text-white/70" />
                    </button>

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/30">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-white">
                                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                                </h2>
                            </div>
                        </div>
                        <p className="text-white/60 text-sm ml-15">
                            {isSignUp
                                ? 'Start your gifting journey with Giftify'
                                : 'Login to continue your shopping experience'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-red-400 font-medium">
                                    {error}
                                </p>
                            </div>
                            <button
                                onClick={clearError}
                                className="text-red-400 hover:text-red-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isSignUp && (
                            <>
                                {/* Name Row - First and Last Name */}
                                <div className="flex gap-3">
                                    <div className="flex-[6]">
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                placeholder="John"
                                                className="w-full pl-11 pr-3 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-[4]">
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Doe"
                                            className="w-full px-3 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-white/80">
                                    Password
                                </label>
                                {!isSignUp && (
                                    <button
                                        type="button"
                                        className="text-xs text-accent-400 hover:text-accent-300 font-medium transition-colors"
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all"
                                />
                            </div>
                            {isSignUp && (
                                <p className="mt-2 text-xs text-white/50">
                                    Must be at least 8 characters long
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-xl font-bold text-base transition-all duration-300 shadow-lg shadow-accent-500/50 hover:scale-[1.02] mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
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
                <div className="p-6 border-t border-white/10 bg-dark-100/30">
                    <div className="text-center">
                        <p className="text-white/70 text-sm">
                            {isSignUp ? (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        onClick={toggleMode}
                                        className="text-accent-400 hover:text-accent-300 font-semibold transition-colors"
                                    >
                                        Login
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{' '}
                                    <button
                                        onClick={toggleMode}
                                        className="text-accent-400 hover:text-accent-300 font-semibold transition-colors"
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
