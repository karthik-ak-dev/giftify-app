import { createContext, useContext, useState, ReactNode } from 'react'

export interface User {
    email: string
    firstName: string
    lastName: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => void
    register: (email: string, password: string, firstName: string, lastName: string) => void
    logout: () => void
    isAuthSidebarOpen: boolean
    openAuthSidebar: () => void
    closeAuthSidebar: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthSidebarOpen, setIsAuthSidebarOpen] = useState(false)

    const login = (email: string, _password: string) => {
        // Mock login - just set a user
        setUser({
            email,
            firstName: 'John',
            lastName: 'Doe'
        })
        closeAuthSidebar()
    }

    const register = (email: string, _password: string, firstName: string, lastName: string) => {
        // Mock register - just set a user
        setUser({
            email,
            firstName,
            lastName
        })
        closeAuthSidebar()
    }

    const logout = () => {
        setUser(null)
    }

    const openAuthSidebar = () => setIsAuthSidebarOpen(true)
    const closeAuthSidebar = () => setIsAuthSidebarOpen(false)

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                isAuthSidebarOpen,
                openAuthSidebar,
                closeAuthSidebar
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

