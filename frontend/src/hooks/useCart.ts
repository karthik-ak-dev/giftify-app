import { useCartStore } from '../store/cartStore';

/**
 * Custom hook for cart operations
 */
export const useCart = () => {
  const {
    isOpen,
    items,
    toggleCart,
    closeCart,
  } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    // State
    isOpen,
    items,
    totalItems,
    totalAmount,
    isEmpty: items.length === 0,
    
    // Actions
    toggleCart,
    closeCart,
  };
}; 