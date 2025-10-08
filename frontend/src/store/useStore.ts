import { create } from 'zustand';
import { CartItem, Order, ToastMessage, Voucher } from '../types';
import { storage } from '../utils/storage';
import { generateOrderId } from '../utils/formatters';

interface StoreState {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  
  // Orders
  orders: Order[];
  
  // Toasts
  toasts: ToastMessage[];
  
  // Modal
  selectedVoucher: Voucher | null;
  isModalOpen: boolean;
  
  // Actions
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (voucherId: string, variantId: string) => void;
  updateQuantity: (voucherId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  
  placeOrder: () => void;
  loadOrders: () => void;
  
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  openModal: (voucher: Voucher) => void;
  closeModal: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  cart: storage.getCart(),
  isCartOpen: false,
  orders: storage.getOrders(),
  toasts: [],
  selectedVoucher: null,
  isModalOpen: false,

  // Cart actions
  addToCart: (item) => {
    const cart = get().cart;
    const existingItem = cart.find(
      (i) => i.voucherId === item.voucherId && i.variantId === item.variantId
    );

    let newCart: CartItem[];
    if (existingItem) {
      newCart = cart.map((i) =>
        i.voucherId === item.voucherId && i.variantId === item.variantId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      newCart = [...cart, { ...item, quantity: 1 }];
    }

    storage.saveCart(newCart);
    set({ cart: newCart });
    get().showToast('Added to cart! 🎉', 'success');
  },

  removeFromCart: (voucherId, variantId) => {
    const cart = get().cart;
    const newCart = cart.filter(
      (i) => !(i.voucherId === voucherId && i.variantId === variantId)
    );
    storage.saveCart(newCart);
    set({ cart: newCart });
  },

  updateQuantity: (voucherId, variantId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(voucherId, variantId);
      return;
    }

    const cart = get().cart;
    const newCart = cart.map((i) =>
      i.voucherId === voucherId && i.variantId === variantId
        ? { ...i, quantity }
        : i
    );
    storage.saveCart(newCart);
    set({ cart: newCart });
  },

  clearCart: () => {
    storage.clearCart();
    set({ cart: [] });
  },

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  setCartOpen: (open) => set({ isCartOpen: open }),

  // Order actions
  placeOrder: () => {
    const cart = get().cart;
    if (cart.length === 0) {
      get().showToast('Cart is empty!', 'error');
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order: Order = {
      id: generateOrderId(),
      items: cart,
      total,
      date: new Date().toISOString(),
      status: 'completed',
    };

    storage.saveOrder(order);
    get().clearCart();
    set({ orders: storage.getOrders(), isCartOpen: false });
    get().showToast('Order placed successfully! 🎉', 'success');
  },

  loadOrders: () => {
    set({ orders: storage.getOrders() });
  },

  // Toast actions
  showToast: (message, type = 'info') => {
    const id = Date.now().toString();
    const toast: ToastMessage = { id, message, type };
    set((state) => ({ toasts: [...state.toasts, toast] }));

    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Modal actions
  openModal: (voucher) => {
    set({ selectedVoucher: voucher, isModalOpen: true });
  },

  closeModal: () => {
    set({ selectedVoucher: null, isModalOpen: false });
  },
}));

