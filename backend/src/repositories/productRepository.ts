import { ProductModel } from '../models/ProductModel';
import { Product } from '../types/product';
import { db } from '../utils/database';

export class ProductRepository {
  async findById(productId: string): Promise<Product | null> {
    const item = await db.get(ProductModel.tableName, { productId });
    return item ? ProductModel.toProduct(item) : null;
  }

  async findAllActive(): Promise<Product[]> {
    const items = await db.queryGSI(
      ProductModel.tableName,
      ProductModel.activeProductsGSI,
      ProductModel.activeProductsGSIPartitionKey,
      'true'
    );
    return items.map(item => ProductModel.toProduct(item));
  }


}

export const productRepository = new ProductRepository(); 