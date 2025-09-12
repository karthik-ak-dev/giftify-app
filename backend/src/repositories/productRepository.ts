import { ProductModel } from '../models/ProductModel';
import { Product } from '../types/product';
import { db } from '../utils/database';

export class ProductRepository {
  async create(productData: any): Promise<Product> {
    const item = await db.put(ProductModel.tableName, productData);
    return ProductModel.toProduct(item);
  }

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

  async findByCategory(category: string): Promise<Product[]> {
    const items = await db.queryGSI(
      ProductModel.tableName,
      ProductModel.categoryGSI,
      ProductModel.categoryGSIPartitionKey,
      category
    );
    return items.map(item => ProductModel.toProduct(item)).filter(product => product.isActive);
  }

  async update(productId: string, updateData: any): Promise<Product> {
    const updatedItem = await db.update(ProductModel.tableName, { productId }, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    return ProductModel.toProduct(updatedItem);
  }

  async delete(productId: string): Promise<void> {
    await db.delete(ProductModel.tableName, { productId });
  }

  async updateStatus(productId: string, isActive: boolean): Promise<void> {
    await db.update(ProductModel.tableName, { productId }, {
      isActive: isActive.toString(),
      updatedAt: new Date().toISOString()
    });
  }
}

export const productRepository = new ProductRepository(); 