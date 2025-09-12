import { ProductVariantModel } from '../models/ProductVariantModel';
import { ProductVariant } from '../types/product';
import { db } from '../utils/database';

export class ProductVariantRepository {
  async create(variantData: any): Promise<ProductVariant> {
    const item = await db.put(ProductVariantModel.tableName, variantData);
    return ProductVariantModel.toProductVariant(item);
  }

  async findById(variantId: string): Promise<ProductVariant | null> {
    const items = await db.queryGSI(
      ProductVariantModel.tableName,
      ProductVariantModel.variantIdGSI,
      ProductVariantModel.variantIdGSIKey,
      variantId
    );
    return items.length > 0 ? ProductVariantModel.toProductVariant(items[0]) : null;
  }

  async findByProductId(productId: string): Promise<ProductVariant[]> {
    const items = await db.query(
      ProductVariantModel.tableName,
      ProductVariantModel.partitionKey,
      productId
    );
    return items.map(item => ProductVariantModel.toProductVariant(item));
  }

  async findActiveByProductId(productId: string): Promise<ProductVariant[]> {
    const items = await db.queryGSI(
      ProductVariantModel.tableName,
      ProductVariantModel.activeVariantsGSI,
      ProductVariantModel.activeVariantsGSIPartitionKey,
      productId
    );
    return items.map(item => ProductVariantModel.toProductVariant(item)).filter(variant => variant.isActive);
  }

  async updateStock(variantId: string, newStock: number): Promise<void> {
    // First find the variant to get productId
    const variant = await this.findById(variantId);
    if (!variant) {
      throw new Error('Variant not found');
    }

    await db.update(
      ProductVariantModel.tableName,
      { productId: variant.productId, variantId },
      {
        stockQuantity: newStock,
        updatedAt: new Date().toISOString()
      }
    );
  }

  async update(productId: string, variantId: string, updateData: any): Promise<ProductVariant> {
    const updatedItem = await db.update(
      ProductVariantModel.tableName,
      { productId, variantId },
      {
        ...updateData,
        updatedAt: new Date().toISOString()
      }
    );
    return ProductVariantModel.toProductVariant(updatedItem);
  }

  async delete(productId: string, variantId: string): Promise<void> {
    await db.delete(ProductVariantModel.tableName, { productId, variantId });
  }

  async updateStatus(productId: string, variantId: string, isActive: boolean): Promise<void> {
    await db.update(
      ProductVariantModel.tableName,
      { productId, variantId },
      {
        isActive: isActive.toString(),
        updatedAt: new Date().toISOString()
      }
    );
  }
}

export const productVariantRepository = new ProductVariantRepository(); 