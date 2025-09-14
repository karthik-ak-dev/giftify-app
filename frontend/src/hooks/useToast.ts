import { useState } from 'react';

/**
 * Toast Types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast Data Interface
 */
export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast Hook for managing toast state
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Add a new toast
  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      id,
      duration: 5000, // Default 5 seconds
      ...toast
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  };

  // Remove a toast by id
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Clear all toasts
  const clearToasts = () => {
    setToasts([]);
  };

  // Convenience methods for different toast types
  const success = (title: string, message?: string, options?: Partial<ToastData>) => {
    return addToast({ type: 'success', title, message, ...options });
  };

  const error = (title: string, message?: string, options?: Partial<ToastData>) => {
    return addToast({ type: 'error', title, message, ...options });
  };

  const warning = (title: string, message?: string, options?: Partial<ToastData>) => {
    return addToast({ type: 'warning', title, message, ...options });
  };

  const info = (title: string, message?: string, options?: Partial<ToastData>) => {
    return addToast({ type: 'info', title, message, ...options });
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info
  };
}; 