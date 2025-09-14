import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import Header from './components/layout/Header';
import CartSidebar from './components/features/CartSidebar';

// UI Components
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ToastContainer, useToast } from './components/ui/Toast';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Hooks
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';

// Styles
import './styles/globals.css';

/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication. Automatically redirects
 * unauthenticated users to the login page.
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Public Route Component
 * 
 * Wraps routes that should only be accessible to unauthenticated users.
 * Redirects authenticated users to the home page.
 */
const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

/**
 * Page Wrapper Component
 * 
 * Wraps each page with consistent animations and error boundaries.
 */
interface PageWrapperProps {
  children: React.ReactNode;
  pageKey: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, pageKey }) => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      // Log page-specific errors
      console.error(`Error in ${pageKey} page:`, error, errorInfo);
    }}
  >
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  </ErrorBoundary>
);

/**
 * Main App Component
 * 
 * The root component of the Giftify application. Handles:
 * - Routing and navigation
 * - Authentication state management
 * - Global layout and components
 * - Error boundaries and error handling
 * - Toast notifications
 * - Cart sidebar management
 * - Page transitions and animations
 * 
 * Architecture:
 * - Uses React Router for client-side routing
 * - Implements protected and public route patterns
 * - Integrates global state management with Zustand
 * - Provides consistent error handling across the app
 * - Manages global UI components (header, cart, toasts)
 */
const App: React.FC = () => {
  // Global state
  const { isOpen: isCartOpen } = useCartStore();
  const { toasts, removeToast } = useToast();

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log application-level errors
        console.error('Application error:', error, errorInfo);

        // In production, send to error monitoring service
        if (process.env.NODE_ENV === 'production') {
          // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
        }
      }}
    >
      <Router>
        <div className="min-h-screen hero-gradient">
          {/* Global Header */}
          <Header />

          {/* Main Content Area */}
          <main className="relative">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes - Only accessible when not authenticated */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <PageWrapper pageKey="login">
                        <Login />
                      </PageWrapper>
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <PageWrapper pageKey="register">
                        <Register />
                      </PageWrapper>
                    </PublicRoute>
                  }
                />

                {/* Protected Routes - Require authentication */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <PageWrapper pageKey="home">
                        <Home />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <PageWrapper pageKey="profile">
                        <Profile />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route - Redirect to appropriate page */}
                <Route
                  path="*"
                  element={<Navigate to="/" replace />}
                />
              </Routes>
            </AnimatePresence>
          </main>

          {/* Global Cart Sidebar */}
          <AnimatePresence>
            {isCartOpen && (
              <ErrorBoundary
                onError={(error) => {
                  console.error('Cart sidebar error:', error);
                }}
              >
                <CartSidebar />
              </ErrorBoundary>
            )}
          </AnimatePresence>

          {/* Global Toast Notifications */}
          <ToastContainer
            toasts={toasts}
            onClose={removeToast}
            position="top-right"
          />

          {/* Global Loading Overlay - For future use */}
          <AnimatePresence>
            {/* Add global loading state here if needed */}
          </AnimatePresence>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
