import { cartRepository } from '../../repositories/cartRepository';
import { productVariantRepository } from '../../repositories/productVariantRepository';
import { CartSummary } from '../../types/cart';

const formatCurrency = (amountInCents: number): string => {
  const amount = amountInCents / 100;
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getCartService = async (userId: string): Promise<{ items: any[]; summary: CartSummary }> => {
  const cart = await cartRepository.findByUserId(userId);
  
  if (!cart) {
    return {
      items: [],
      summary: {
        totalItems: 0,
        totalAmount: 0,
        totalAmountFormatted: '₹0.00'
      }
    };
  }

  // Add stock availability to each item
  const itemsWithStock = await Promise.all(
    cart.items.map(async (item) => {
      const variant = await productVariantRepository.findById(item.variantId);
      return {
        ...item,
        stockAvailable: variant?.stockQuantity || 0
      };
    })
  );

  return {
    items: itemsWithStock,
    summary: {
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount,
      totalAmountFormatted: formatCurrency(cart.totalAmount)
    }
  };
}; 