import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import Header from './components/layout/Header';
import CartSidebar from './components/features/CartSidebar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Hooks
import { useAuthStore } from './store/authStore';

/**
 * Main Application Component
 * 
 * Features:
 * - React Router for navigation
 * - Authentication-based routing
 * - Global layout with header and cart
 * - Responsive design
 * - Loading states
 */
const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-pink mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading Giftify...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-bg-primary">
        {/* Global Header - only show when authenticated */}
        {isAuthenticated && <Header />}

        {/* Main Content */}
        <main className={isAuthenticated ? 'pt-16' : ''}>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Login />
                    </motion.div>
                  )
                }
              />

              <Route
                path="/register"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Register />
                    </motion.div>
                  )
                }
              />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Home />
                    </motion.div>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/profile"
                element={
                  isAuthenticated ? (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Profile />
                    </motion.div>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Catch all route */}
              <Route
                path="*"
                element={
                  <Navigate to={isAuthenticated ? "/" : "/login"} replace />
                }
              />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Global Cart Sidebar - only show when authenticated */}
        {isAuthenticated && (
          <AnimatePresence>
            <CartSidebar />
          </AnimatePresence>
        )}
      </div>
    </Router>
  );
};

export default App;
