export interface VoucherVariant {
  id: string;
  denomination: number;
  price: number;
}

export interface Voucher {
  id: string;
  name: string;
  brand: string;
  description: string;
  icon: string;
  variants: VoucherVariant[];
  category: string;
  color: string;
}

export interface CartItem {
  voucherId: string;
  variantId: string;
  voucherName: string;
  denomination: number;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

