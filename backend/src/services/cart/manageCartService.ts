import { cartRepository } from '../../repositories/cartRepository';
import { productVariantRepository } from '../../repositories/productVariantRepository';
import { productRepository } from '../../repositories/productRepository';
import { AppError } from '../../middleware/errorHandler';

const formatCurrency = (amountInCents: number): string => {
  const amount = amountInCents / 100;
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const calculateTotals = (items: any[]): { totalAmount: number; totalItems: number } => {
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { totalAmount, totalItems };
};

export const manageCartService = async (userId: string, variantId: string, quantity: number) => {
  // If quantity is 0, remove item
  if (quantity === 0) {
    const cart = await cartRepository.findByUserId(userId);
    
    if (!cart) {
      throw new AppError('Cart not found', 404, 'CART_NOT_FOUND');
    }

    // Remove item
    cart.items = cart.items.filter(item => item.variantId !== variantId);

    // Recalculate totals
    const totals = calculateTotals(cart.items);
    cart.totalAmount = totals.totalAmount;
    cart.totalItems = totals.totalItems;
    cart.updatedAt = new Date().toISOString();

    // Save cart
    await cartRepository.save(cart);

    return {
      message: 'Item removed from cart',
      cartSummary: {
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        totalAmountFormatted: formatCurrency(cart.totalAmount)
      }
    };
  }

  // Get variant details
  const variant = await productVariantRepository.findById(variantId);
  if (!variant) {
    throw new AppError('Product variant not found', 404, 'VARIANT_NOT_FOUND');
  }

  if (!variant.isActive) {
    throw new AppError('Product variant is not active', 400, 'VARIANT_INACTIVE');
  }
  
  // Check quantity constraints
  if (quantity < variant.minOrderQuantity || quantity > variant.maxOrderQuantity) {
    throw new AppError(
      `Quantity must be between ${variant.minOrderQuantity} and ${variant.maxOrderQuantity}`,
      400,
      'INVALID_QUANTITY'
    );
  }

  // Check stock availability
  if (quantity > variant.stockQuantity) {
    throw new AppError(
      `Only ${variant.stockQuantity} items available in stock`,
      400,
      'INSUFFICIENT_STOCK'
    );
  }

  // Get current cart
  let cart = await cartRepository.findByUserId(userId);
  
  if (!cart) {
    // Create new cart
    cart = {
      userId,
      items: [],
      totalAmount: 0,
      totalItems: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Find existing item
  const existingItemIndex = cart.items.findIndex(item => item.variantId === variantId);
  
  const cartItem = {
    variantId,
    productId: variant.productId,
    productName: '', // Will be populated from product details
    variantName: variant.name,
    quantity,
    unitPrice: variant.sellingPrice,
    totalPrice: variant.sellingPrice * quantity
  };

  // Get product details for product name
  const product = await productRepository.findById(variant.productId);
  if (product) {
    cartItem.productName = product.name;
  }

  if (existingItemIndex >= 0) {
    // Update existing item
    cart.items[existingItemIndex] = cartItem;
  } else {
    // Add new item
    cart.items.push(cartItem);
  }

  // Recalculate totals
  const totals = calculateTotals(cart.items);
  cart.totalAmount = totals.totalAmount;
  cart.totalItems = totals.totalItems;
  cart.updatedAt = new Date().toISOString();

  // Save cart
  await cartRepository.save(cart);

  return {
    message: 'Cart updated successfully',
    cartSummary: {
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount,
      totalAmountFormatted: formatCurrency(cart.totalAmount)
    }
  };
}; 