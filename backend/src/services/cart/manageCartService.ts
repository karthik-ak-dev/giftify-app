import { cartRepository } from '../../repositories/cartRepository';
import { productVariantRepository } from '../../repositories/productVariantRepository';
import { productRepository } from '../../repositories/productRepository';
import { Cart } from '../../models/CartModel';
import { AppError } from '../../middleware/errorHandler';

export const manageCartService = async (userId: string, variantId: string, quantity: number) => {
  try {
    // Validate quantity
    if (quantity < 0) {
      throw new AppError('Quantity cannot be negative', 400, 'INVALID_QUANTITY');
    }

    // Get variant details first to validate
    const variant = await productVariantRepository.findById(variantId);
    if (!variant) {
      throw new AppError('Product variant not found', 404, 'VARIANT_NOT_FOUND');
    }
    
    if (!variant.isActive) {
      throw new AppError('Product variant is not active', 400, 'VARIANT_INACTIVE');
    }

    // Get product details for complete item information
    const product = await productRepository.findById(variant.productId);
    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    if (!product.isActive) {
      throw new AppError('Product is not active', 400, 'PRODUCT_INACTIVE');
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

    // Validate quantity constraints
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

    // Create cart item data
    const cartItemData = {
      variantId,
      productId: variant.productId,
      productName: product.name,
      variantName: variant.name,
      quantity,
      unitPrice: variant.sellingPrice
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