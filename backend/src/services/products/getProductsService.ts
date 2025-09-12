import { productRepository } from '../../repositories/productRepository';
import { productVariantRepository } from '../../repositories/productVariantRepository';
import { ProductWithVariants } from '../../types/product';

export const getProductsService = async (): Promise<ProductWithVariants[]> => {
  // Get all active products
  const products = await productRepository.findAllActive();
  
  // Get variants for each product
  const productsWithVariants: ProductWithVariants[] = [];
  
  for (const product of products) {
    const variants = await productVariantRepository.findByProductId(product.productId);
    
    productsWithVariants.push({
      ...product,
      variants: variants.filter(variant => variant.isActive)
    });
  }

  return productsWithVariants;
}; 