/**
 * ============================================================================
 * 🔐 PRODUCTION-READY AUTHENTICATION CONTEXT
 * ============================================================================
 * 
 * This file implements a complete, enterprise-grade authentication system with:
 * - Automatic token refresh (5 minutes before expiry)
 * - Session persistence across page refreshes
 * - Token validation and error handling
 * - User profile management
 * - Loading states and error recovery
 * 
 * FLOW OVERVIEW:
 * 1. App starts → Check localStorage for tokens
 * 2. If tokens exist → Validate access token
 * 3. If expired → Refresh using refresh token
 * 4. Load user profile from backend
 * 5. Schedule automatic token refresh
 * 6. User stays logged in seamlessly
 * 
 * KEY FEATURES:
 * - 🔄 Auto-refresh prevents token expiry interruptions
 * - 💾 Session persistence across browser refreshes
 * - 🛡️ Comprehensive error handling and recovery
 * - ⏳ Loading states prevent UI flicker
 * - 👤 Real-time user profile management
 */

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { authService, tokenService } from '../services/authService'
import { fetchUserProfile } from '../services/userService'
import { isTokenExpired, getTimeUntilExpiry } from '../utils/jwt'

/**
 * User interface - represents the authenticated user
 * Includes all user data fetched from backend profile endpoint
 */
export interface User {
    userId: string
    email: string
    firstName: string
    lastName: string
    walletBalance: number
    phoneNumber?: string
    isEmailVerified: boolean
}

/**
 * AuthContext interface - defines all available auth methods and state
 * This is what components receive when they use useAuth()
 */
interface AuthContextType {
    user: User | null                    // Current user object or null
    isAuthenticated: boolean            // Computed: user !== null
    isLoading: boolean                  // Auth operation in progress (login/register)
    isInitializing: boolean            // App startup auth check in progress
    error: string | null               // Current error message
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
    logout: () => void
    refreshUserProfile: () => Promise<void>  // Manually refresh user profile
    isAuthSidebarOpen: boolean         // Auth sidebar visibility
    openAuthSidebar: () => void
    closeAuthSidebar: () => void
    clearError: () => void
}

// Create React context for authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Custom hook to access authentication context
 * Throws error if used outside AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

/**
 * ============================================================================
 * 🏗️ AUTH PROVIDER COMPONENT
 * ============================================================================
 * 
 * This is the main authentication provider that wraps the entire app.
 * It manages all authentication state and provides methods to child components.
 * 
 * STATE MANAGEMENT:
 * - user: Current authenticated user (null if not logged in)
 * - isAuthSidebarOpen: Controls auth sidebar visibility
 * - isLoading: True during login/register operations
 * - isInitializing: True during app startup auth check
 * - error: Current error message to display
 * 
 * TOKEN REFRESH MANAGEMENT:
 * - refreshTimeoutRef: Stores timeout ID for scheduled token refresh
 * - isRefreshingRef: Prevents multiple simultaneous refresh attempts
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // ============================================================================
    // 📊 STATE DECLARATIONS
    // ============================================================================

    const [user, setUser] = useState<User | null>(null)                    // Current user
    const [isAuthSidebarOpen, setIsAuthSidebarOpen] = useState(false)     // Auth sidebar state
    const [isLoading, setIsLoading] = useState(false)                     // Auth operation loading
    const [isInitializing, setIsInitializing] = useState(true)            // App startup loading
    const [error, setError] = useState<string | null>(null)               // Current error

    // ============================================================================
    // 🔄 TOKEN REFRESH MANAGEMENT
    // ============================================================================

    // Store timeout ID for scheduled token refresh
    const refreshTimeoutRef = useRef<number | null>(null)

    // Prevent multiple simultaneous refresh attempts
    const isRefreshingRef = useRef(false)

    /**
     * ============================================================================
     * 🔄 TOKEN REFRESH LOGIC
     * ============================================================================
     * 
     * This function handles automatic token refresh using the refresh token.
     * It's called automatically before tokens expire to prevent auth interruptions.
     * 
     * FLOW:
     * 1. Check if already refreshing (prevent duplicates)
     * 2. Get refresh token from localStorage
     * 3. Validate refresh token (not expired)
     * 4. Call backend refresh endpoint
     * 5. Update tokens in localStorage
     * 6. Return success/failure
     * 
     * ERROR HANDLING:
     * - If refresh token expired → Logout user
     * - If network error → Logout user
     * - If already refreshing → Return false
     */
    const refreshAccessToken = useCallback(async (): Promise<boolean> => {
        // Prevent multiple simultaneous refresh attempts
        if (isRefreshingRef.current) {
            return false
        }

        const refreshToken = tokenService.getRefreshToken()
        if (!refreshToken || isTokenExpired(refreshToken)) {
            // Refresh token is expired or missing, logout user
            logout()
            return false
        }

        try {
            isRefreshingRef.current = true
            await authService.refreshToken()
            return true
        } catch (error) {
            console.error('Failed to refresh token:', error)
            // Refresh failed, logout user
            logout()
            return false
        } finally {
            isRefreshingRef.current = false
        }
    }, [])

    /**
     * ============================================================================
     * ⏰ AUTOMATIC TOKEN REFRESH SCHEDULER
     * ============================================================================
     * 
     * This function schedules automatic token refresh to prevent auth interruptions.
     * It calculates when the token will expire and schedules a refresh 5 minutes before.
     * 
     * SCHEDULING LOGIC:
     * 1. Clear any existing timeout
     * 2. Get current access token
     * 3. Calculate time until expiry (with 5-min buffer)
     * 4. If already expired → Refresh immediately
     * 5. If not expired → Schedule refresh for later
     * 6. After successful refresh → Schedule next refresh
     * 
     * BUFFER TIME:
     * - Tokens refresh 5 minutes before actual expiry
     * - This prevents users from experiencing auth interruptions
     * - Gives time for network delays and retries
     */
    const scheduleTokenRefresh = useCallback(() => {
        // Clear existing timeout to prevent duplicates
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current)
        }

        const accessToken = tokenService.getAccessToken()
        if (!accessToken) {
            return
        }

        // Get time until token expiry (with 5 min buffer already included)
        const timeUntilExpiry = getTimeUntilExpiry(accessToken)

        if (timeUntilExpiry === null || timeUntilExpiry <= 0) {
            // Token is already expired, try to refresh immediately
            refreshAccessToken()
            return
        }

        // Schedule refresh before token expires
        refreshTimeoutRef.current = setTimeout(() => {
            refreshAccessToken().then(success => {
                if (success) {
                    // Schedule next refresh after successful refresh
                    scheduleTokenRefresh()
                }
            })
        }, timeUntilExpiry)
    }, [refreshAccessToken])

    /**
     * ============================================================================
     * 👤 USER PROFILE LOADER
     * ============================================================================
     * 
     * This function fetches the user's profile from the backend API.
     * It includes comprehensive error handling and automatic token refresh.
     * 
     * PROFILE DATA INCLUDES:
     * - Basic info: userId, email, firstName, lastName
     * - Wallet: walletBalance
     * - Contact: phoneNumber
     * - Status: isEmailVerified
     * 
     * ERROR HANDLING:
     * 1. If 401 Unauthorized → Try to refresh token once
     * 2. If refresh succeeds → Retry profile fetch
     * 3. If refresh fails → Logout user
     * 4. If other errors → Clear tokens and logout
     * 
     * RETRY LOGIC:
     * - Only retries once to prevent infinite loops
     * - Uses refreshed token for retry attempt
     * - Falls back to logout if retry fails
     */
    const loadUserProfile = useCallback(async (): Promise<void> => {
        try {
            const profile = await fetchUserProfile()
            setUser({
                userId: profile.userId,
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                walletBalance: profile.walletBalance,
                phoneNumber: profile.phoneNumber,
                isEmailVerified: profile.isEmailVerified,
            })
        } catch (error) {
            console.error('Failed to load user profile:', error)
            // If profile load fails and it's an auth error, logout
            if (error instanceof Error && error.message === 'UNAUTHORIZED') {
                // Try to refresh token once
                const refreshed = await refreshAccessToken()
                if (refreshed) {
                    // Retry loading profile after refresh
                    try {
                        const profile = await fetchUserProfile()
                        setUser({
                            userId: profile.userId,
                            email: profile.email,
                            firstName: profile.firstName,
                            lastName: profile.lastName,
                            walletBalance: profile.walletBalance,
                            phoneNumber: profile.phoneNumber,
                            isEmailVerified: profile.isEmailVerified,
                        })
                    } catch (retryError) {
                        logout()
                    }
                } else {
                    logout()
                }
            } else {
                // Other errors, just clear tokens
                tokenService.clearTokens()
                setUser(null)
            }
        }
    }, [refreshAccessToken])

    /**
     * ============================================================================
     * 🚀 APP INITIALIZATION EFFECT
     * ============================================================================
     * 
     * This useEffect runs when the app starts and handles:
     * 1. Checking for existing tokens in localStorage
     * 2. Validating and refreshing expired tokens
     * 3. Loading user profile from backend
     * 4. Scheduling automatic token refresh
     * 5. Setting isInitializing to false
     * 
     * INITIALIZATION FLOW:
     * 1. Set isInitializing = true (show loading)
     * 2. Check localStorage for tokens
     * 3. If no tokens → User not logged in
     * 4. If tokens exist → Validate access token
     * 5. If expired → Try to refresh
     * 6. If refresh fails → User not logged in
     * 7. If valid/refreshed → Load user profile
     * 8. Schedule automatic token refresh
     * 9. Set isInitializing = false (hide loading)
     * 
     * CLEANUP:
     * - Clears timeout on component unmount
     * - Prevents memory leaks from scheduled refreshes
     */
    useEffect(() => {
        const initializeAuth = async () => {
            setIsInitializing(true)

            const accessToken = tokenService.getAccessToken()
            const refreshToken = tokenService.getRefreshToken()

            // No tokens, user is not logged in
            if (!accessToken || !refreshToken) {
                setIsInitializing(false)
                return
            }

            // Check if access token is expired
            if (isTokenExpired(accessToken)) {
                // Try to refresh token
                const refreshed = await refreshAccessToken()
                if (!refreshed) {
                    setIsInitializing(false)
                    return
                }
            }

            // Load user profile
            await loadUserProfile()

            // Schedule automatic token refresh
            scheduleTokenRefresh()

            setIsInitializing(false)
        }

        initializeAuth()

        // Cleanup on unmount
        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current)
            }
        }
    }, [loadUserProfile, refreshAccessToken, scheduleTokenRefresh])

    /**
     * ============================================================================
     * 🔑 USER LOGIN
     * ============================================================================
     * 
     * Handles user login with email and password.
     * 
     * LOGIN FLOW:
     * 1. Set loading state (show spinner)
     * 2. Clear any previous errors
     * 3. Call backend login API
     * 4. If successful → Store user data and tokens
     * 5. Schedule automatic token refresh
     * 6. Close auth sidebar
     * 7. If failed → Show error message
     * 8. Clear loading state
     * 
     * SUCCESS ACTIONS:
     * - User data stored in state
     * - Tokens stored in localStorage
     * - Auto-refresh scheduled
     * - Sidebar closed
     * 
     * ERROR HANDLING:
     * - Network errors → Display error message
     * - Invalid credentials → Display error message
     * - Server errors → Display error message
     */
    const login = async (email: string, password: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await authService.login({ email, password })

            if (response.success && response.data.user) {
                setUser({
                    userId: response.data.user.userId,
                    email: response.data.user.email,
                    firstName: response.data.user.firstName,
                    lastName: response.data.user.lastName,
                    walletBalance: response.data.user.walletBalance,
                    isEmailVerified: false, // Backend might not return this, default to false
                })

                // Schedule token refresh after successful login
                scheduleTokenRefresh()

                closeAuthSidebar()
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed'
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * ============================================================================
     * 📝 USER REGISTRATION
     * ============================================================================
     * 
     * Handles new user registration with email, password, and name.
     * 
     * REGISTRATION FLOW:
     * 1. Set loading state (show spinner)
     * 2. Clear any previous errors
     * 3. Call backend register API
     * 4. If successful → Store user data and tokens
     * 5. Schedule automatic token refresh
     * 6. Close auth sidebar
     * 7. If failed → Show error message
     * 8. Clear loading state
     * 
     * SUCCESS ACTIONS:
     * - User data stored in state
     * - Tokens stored in localStorage
     * - Auto-refresh scheduled
     * - Sidebar closed
     * 
     * ERROR HANDLING:
     * - Email already exists → Display error
     * - Invalid email format → Display error
     * - Weak password → Display error
     * - Network errors → Display error
     */
    const register = async (email: string, password: string, firstName: string, lastName: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await authService.register({ email, password, firstName, lastName })

            if (response.success && response.data.user) {
                setUser({
                    userId: response.data.user.userId,
                    email: response.data.user.email,
                    firstName: response.data.user.firstName,
                    lastName: response.data.user.lastName,
                    walletBalance: response.data.user.walletBalance,
                    isEmailVerified: false, // Backend might not return this, default to false
                })

                // Schedule token refresh after successful registration
                scheduleTokenRefresh()

                closeAuthSidebar()
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed'
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * ============================================================================
     * 🚪 USER LOGOUT
     * ============================================================================
     * 
     * Handles complete user logout and cleanup.
     * 
     * LOGOUT ACTIONS:
     * 1. Cancel scheduled token refresh
     * 2. Clear tokens from localStorage
     * 3. Clear user state
     * 4. Clear error state
     * 5. Reset all auth-related state
     * 
     * CLEANUP:
     * - Prevents memory leaks from timeouts
     * - Ensures clean logout state
     * - Removes all authentication data
     */
    const logout = useCallback(() => {
        // Clear refresh timeout
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current)
            refreshTimeoutRef.current = null
        }

        // Clear tokens and user state
        authService.logout()
        setUser(null)
        setError(null)
    }, [])

    /**
     * ============================================================================
     * 🔄 MANUAL PROFILE REFRESH
     * ============================================================================
     * 
     * Allows manual refresh of user profile data.
     * Useful after operations like wallet top-up or profile updates.
     * 
     * USAGE:
     * - Call after wallet operations
     * - Call after profile updates
     * - Call to sync latest user data
     * 
     * SAFETY:
     * - Only works if user is logged in
     * - Handles errors gracefully
     * - Doesn't throw errors to caller
     */
    const refreshUserProfile = useCallback(async () => {
        if (!user) return

        try {
            await loadUserProfile()
        } catch (error) {
            console.error('Failed to refresh user profile:', error)
        }
    }, [user, loadUserProfile])

    // ============================================================================
    // 🎛️ UI CONTROL FUNCTIONS
    // ============================================================================

    const clearError = useCallback(() => setError(null), [])
    const openAuthSidebar = useCallback(() => setIsAuthSidebarOpen(true), [])
    const closeAuthSidebar = useCallback(() => setIsAuthSidebarOpen(false), [])

    /**
     * ============================================================================
     * 🎯 CONTEXT PROVIDER RENDER
     * ============================================================================
     * 
     * Renders the AuthContext.Provider with all authentication state and methods.
     * This makes all auth functionality available to child components via useAuth().
     * 
     * PROVIDED VALUES:
     * - user: Current user object or null
     * - isAuthenticated: Boolean computed from user
     * - isLoading: Auth operation in progress
     * - isInitializing: App startup auth check
     * - error: Current error message
     * - login/register: Auth operations
     * - logout: Clean logout
     * - refreshUserProfile: Manual profile refresh
     * - UI controls: Sidebar open/close, error clear
     */
    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                isInitializing,
                error,
                login,
                register,
                logout,
                refreshUserProfile,
                isAuthSidebarOpen,
                openAuthSidebar,
                closeAuthSidebar,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

