import { cartRepository } from '../../repositories/cartRepository';
import { brandRepository } from '../../repositories/brandRepository';
import { CartSummary, CartItemWithStock } from '../../types/cart';
import { formatCurrency } from '../../utils/currency';
import { AppError } from '../../middleware/errorHandler';

export const getCartService = async (userId: string): Promise<{ 
  items: CartItemWithStock[]; 
  summary: CartSummary;
  hasOutOfStockItems: boolean;
}> => {
  try {
    // Find user's cart
    const cart = await cartRepository.findByUserId(userId);
    
    if (!cart || cart.items.length === 0) {
      return {
        items: [],
        summary: {
          totalItems: 0,
          totalAmount: 0,
          totalAmountFormatted: formatCurrency(0)
        },
        hasOutOfStockItems: false
      };
    }

    // Add stock availability to each item
    const itemsWithStock: CartItemWithStock[] = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const result = await brandRepository.findByVariantId(item.variantId);
          const stockAvailable = result?.variant?.stockQuantity || 0;
          const isInStock = stockAvailable >= item.quantity;
          
          return {
            ...item,
            stockAvailable,
            isInStock
          };
        } catch (error) {
          // If variant lookup fails, mark as out of stock
          return {
            ...item,
            stockAvailable: 0,
            isInStock: false
          };
        }
      })
    );

    // Check if any items are out of stock
    const hasOutOfStockItems = itemsWithStock.some(item => !item.isInStock);

    // Use Cart model's computed properties for summary
    return {
      items: itemsWithStock,
      summary: {
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        totalAmountFormatted: cart.formattedTotalAmount
      },
      hasOutOfStockItems
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new AppError(`Failed to get cart: ${error.message}`, 500, 'CART_FETCH_FAILED');
    }
    
    throw new AppError('Failed to get cart', 500, 'CART_FETCH_FAILED');
  }
}; 