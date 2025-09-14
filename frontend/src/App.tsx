import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import Header from './components/layout/Header';
import CartSidebar from './components/features/CartSidebar';
import AuthSidebar from './components/features/AuthSidebar';

// Pages
import Home from './pages/Home';
import Profile from './pages/Profile';

// Hooks
import { useAuthStore } from './store/authStore';

/**
 * Main Application Component
 * 
 * Features:
 * - Public product listing (no auth required)
 * - Auth sidebar for seamless login/register
 * - Protected routes for profile
 * - Responsive design
 */
const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [authSidebarOpen, setAuthSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Function to open auth sidebar
  const openAuthSidebar = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthSidebarOpen(true);
  };

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
        {/* Global Header - always show */}
        <Header onAuthClick={openAuthSidebar} />

        {/* Main Content */}
        <main className="pt-16">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Home onAuthRequired={openAuthSidebar} />
                  </motion.div>
                }
              />

              {/* Protected Routes */}
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
                    <Navigate to="/" replace />
                  )
                }
              />

              {/* Catch all route */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
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

        {/* Auth Sidebar - for seamless login/register */}
        <AnimatePresence>
          {authSidebarOpen && (
            <AuthSidebar
              isOpen={authSidebarOpen}
              onClose={() => setAuthSidebarOpen(false)}
              defaultMode={authMode}
            />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App;
