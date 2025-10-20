import { cartRepository } from '../../repositories/cartRepository';
import { brandRepository } from '../../repositories/brandRepository';
import { Cart } from '../../models/CartModel';
import { AppError } from '../../middleware/errorHandler';

export const manageCartService = async (userId: string, variantId: string, quantity: number) => {
  try {
    // Validate quantity
    if (quantity < 0) {
      throw new AppError('Quantity cannot be negative', 400, 'INVALID_QUANTITY');
    }

    // Get brand and variant details first to validate
    const result = await brandRepository.findByVariantId(variantId);
    if (!result) {
      throw new AppError('Brand variant not found', 404, 'VARIANT_NOT_FOUND');
    }

    const { brand, variant } = result;
    
    if (!brand.isActive) {
      throw new AppError('Brand is not active', 400, 'BRAND_INACTIVE');
    }

    if (variant.isActive === false) {
      throw new AppError('Variant is not active', 400, 'VARIANT_INACTIVE');
    }

    // Get or create cart
    let cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      cart = Cart.create(userId);
      await cartRepository.create(cart);
    }

    // Handle remove item (quantity = 0)
    if (quantity === 0) {
      if (!cart.hasItem(variantId)) {
        throw new AppError('Item not found in cart', 404, 'ITEM_NOT_FOUND');
      }

      cart.removeItem(variantId);
      await cartRepository.save(cart);

      return {
        message: 'Item removed from cart',
        cartSummary: {
          totalItems: cart.totalItems,
          totalAmount: cart.totalAmount,
          totalAmountFormatted: cart.formattedTotalAmount
        }
      };
    }

    // Check stock availability (if stock quantity is defined)
    if (variant.stockQuantity !== undefined && quantity > variant.stockQuantity) {
      throw new AppError(
        `Only ${variant.stockQuantity} items available in stock`,
        400,
        'INSUFFICIENT_STOCK'
      );
    }

    // Create cart item data (convert sale price from rupees to paise)
    const cartItemData = {
      brandId: brand.brandId,
      brandName: brand.name,
      variantId,
      variantName: variant.name,
      quantity,
      unitPrice: Math.round(variant.salePrice * 100) // Convert rupees to paise
    };

    // Add or update item using Cart model methods
    if (cart.hasItem(variantId)) {
      cart.updateItemQuantity(variantId, quantity);
    } else {
      cart.addItem(cartItemData);
    }

    // Save the updated cart
    await cartRepository.save(cart);

    return {
      message: cart.hasItem(variantId) ? 'Cart updated successfully' : 'Item added to cart',
      cartSummary: {
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        totalAmountFormatted: cart.formattedTotalAmount
      },
      item: {
        ...cartItemData,
        totalPrice: cartItemData.unitPrice * quantity
      }
    };

  } catch (error) {
    // Re-throw AppErrors
    if (error instanceof AppError) {
      throw error;
    }

    // Handle Cart model validation errors
    if (error instanceof Error && (
      error.message.includes('required') ||
      error.message.includes('must be positive') ||
      error.message.includes('cannot be empty') ||
      error.message.includes('Item not found') ||
      error.message.includes('Item already exists')
    )) {
      throw new AppError(`Cart validation error: ${error.message}`, 400, 'CART_VALIDATION_ERROR');
    }

    // Handle repository errors
    if (error instanceof Error && error.message.includes('already exists')) {
      throw new AppError('Cart operation failed due to conflict', 409, 'CART_CONFLICT');
    }

    // Handle any other unexpected errors
    if (error instanceof Error) {
      throw new AppError(`Failed to manage cart: ${error.message}`, 500, 'CART_OPERATION_FAILED');
    }

    throw new AppError('Failed to manage cart', 500, 'CART_OPERATION_FAILED');
  }
}; 