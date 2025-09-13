import { cartRepository } from '../../repositories/cartRepository';
import { AppError } from '../../middleware/errorHandler';

export const clearCartService = async (userId: string): Promise<void> => {
  try {
    // Find the user's cart
    const cart = await cartRepository.findByUserId(userId);
    
    if (!cart) {
      // If no cart exists, consider it already cleared
      return;
    }

    // Clear the cart using the Cart model method
    cart.clear();
    
    // Save the cleared cart
    await cartRepository.save(cart);
  } catch (error) {
    // Handle any unexpected errors
    if (error instanceof Error) {
      throw new AppError(`Failed to clear cart: ${error.message}`, 500, 'CART_CLEAR_FAILED');
    }
    throw new AppError('Failed to clear cart', 500, 'CART_CLEAR_FAILED');
  }
}; 