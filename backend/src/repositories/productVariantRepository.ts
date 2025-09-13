import { ProductVariantModel } from '../models/ProductVariantModel';
import { ProductVariant } from '../types/product';
import { db } from '../utils/database';

export class ProductVariantRepository {
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


}

export const productVariantRepository = new ProductVariantRepository(); 