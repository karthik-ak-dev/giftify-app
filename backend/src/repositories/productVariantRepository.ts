import { ProductVariant, PRODUCT_VARIANT_TABLE, VARIANT_ID_GSI } from '../models/ProductVariantModel';
import { db } from '../utils/database';

export class ProductVariantRepository {
  async create(variant: ProductVariant): Promise<ProductVariant> {
    await db.put(PRODUCT_VARIANT_TABLE, variant);
    return variant;
  }

  async findById(variantId: string): Promise<ProductVariant | null> {
    const items = await db.queryGSI(PRODUCT_VARIANT_TABLE, VARIANT_ID_GSI, 'variantId', variantId);
    return items.length > 0 ? new ProductVariant(items[0] as any) : null;
  }

  async findByProductId(productId: string): Promise<ProductVariant[]> {
    const items = await db.query(PRODUCT_VARIANT_TABLE, 'productId', productId);
    return items.map(item => new ProductVariant(item as any));
  }

  async findActiveByProductId(productId: string): Promise<ProductVariant[]> {
    const items = await db.query(PRODUCT_VARIANT_TABLE, 'productId', productId);
    const activeVariants = items.filter(item => item.isActive === true);
    return activeVariants.map(item => new ProductVariant(item as any));
  }

  async save(variant: ProductVariant): Promise<ProductVariant> {
    variant.update({}); // This updates the updatedAt timestamp
    await db.put(PRODUCT_VARIANT_TABLE, variant);
    return variant;
  }

  async updateStock(variant: ProductVariant, newStock: number): Promise<ProductVariant> {
    variant.update({ stockQuantity: newStock });
    await db.update(PRODUCT_VARIANT_TABLE, 
      { productId: variant.productId, variantId: variant.variantId }, 
      {
        stockQuantity: variant.stockQuantity,
        updatedAt: variant.updatedAt
      }
    );
    return variant;
  }

  async addStock(variant: ProductVariant, quantity: number): Promise<ProductVariant> {
    variant.addStock(quantity);
    await db.update(PRODUCT_VARIANT_TABLE, 
      { productId: variant.productId, variantId: variant.variantId }, 
      {
        stockQuantity: variant.stockQuantity,
        updatedAt: variant.updatedAt
      }
    );
    return variant;
  }

  async reduceStock(variant: ProductVariant, quantity: number): Promise<ProductVariant> {
    variant.reduceStock(quantity);
    await db.update(PRODUCT_VARIANT_TABLE, 
      { productId: variant.productId, variantId: variant.variantId }, 
      {
        stockQuantity: variant.stockQuantity,
        updatedAt: variant.updatedAt
      }
    );
    return variant;
  }

  async activate(variant: ProductVariant): Promise<ProductVariant> {
    variant.activate();
    await db.update(PRODUCT_VARIANT_TABLE, 
      { productId: variant.productId, variantId: variant.variantId }, 
      {
        isActive: variant.isActive,
        updatedAt: variant.updatedAt
      }
    );
    return variant;
  }

  async deactivate(variant: ProductVariant): Promise<ProductVariant> {
    variant.deactivate();
    await db.update(PRODUCT_VARIANT_TABLE, 
      { productId: variant.productId, variantId: variant.variantId }, 
      {
        isActive: variant.isActive,
        updatedAt: variant.updatedAt
      }
    );
    return variant;
  }

  async findLowStockVariants(threshold?: number): Promise<ProductVariant[]> {
    const items = await db.scan(PRODUCT_VARIANT_TABLE, {
      FilterExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':active': true
      }
    });
    
    const lowStockVariants = items.filter(item => {
      const variant = new ProductVariant(item as any);
      return threshold ? variant.stockQuantity <= threshold : variant.hasLowStock;
    });
    
    return lowStockVariants.map(item => new ProductVariant(item as any));
  }

  async findOutOfStockVariants(): Promise<ProductVariant[]> {
    const items = await db.scan(PRODUCT_VARIANT_TABLE, {
      FilterExpression: 'isActive = :active AND stockQuantity = :zero',
      ExpressionAttributeValues: {
        ':active': true,
        ':zero': 0
      }
    });
    
    return items.map(item => new ProductVariant(item as any));
  }

  async delete(variant: ProductVariant): Promise<void> {
    await db.delete(PRODUCT_VARIANT_TABLE, { 
      productId: variant.productId, 
      variantId: variant.variantId 
    });
  }
}

export const productVariantRepository = new ProductVariantRepository(); 