import { cartRepository } from '../../repositories/cartRepository';
 
export const clearCartService = async (userId: string): Promise<void> => {
  await cartRepository.delete(userId);
}; 