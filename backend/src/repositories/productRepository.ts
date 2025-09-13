import { Product, ProductCategory, PRODUCT_TABLE, ACTIVE_PRODUCTS_GSI } from '../models/ProductModel';
import { db } from '../utils/database';

export class ProductRepository {
  async create(product: Product): Promise<Product> {
    await db.put(PRODUCT_TABLE, product);
    return product;
  }

  async findById(productId: string): Promise<Product | null> {
    const item = await db.get(PRODUCT_TABLE, { productId });
    return item ? new Product(item as any) : null;
  }

  async findAllActive(): Promise<Product[]> {
    // Query GSI for active products (isActive stored as string 'true' for GSI)
    const items = await db.queryGSI(PRODUCT_TABLE, ACTIVE_PRODUCTS_GSI, 'isActive', 'true');
    return items.map(item => new Product({
      ...item,
      isActive: item.isActive === 'true' || item.isActive === true
    } as any));
  }

  async findAll(): Promise<Product[]> {
    const items = await db.scan(PRODUCT_TABLE, {});
    return items.map(item => new Product({
      ...item,
      isActive: item.isActive === 'true' || item.isActive === true
    } as any));
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    const items = await db.scan(PRODUCT_TABLE, {
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    });
    return items.map(item => new Product({
      ...item,
      isActive: item.isActive === 'true' || item.isActive === true
    } as any));
  }

  async findActiveByCategory(category: ProductCategory): Promise<Product[]> {
    const items = await db.scan(PRODUCT_TABLE, {
      FilterExpression: 'category = :category AND isActive = :active',
      ExpressionAttributeValues: {
        ':category': category,
        ':active': 'true'
      }
    });
    return items.map(item => new Product({
      ...item,
      isActive: true
    } as any));
  }

  async findByBrand(brand: string): Promise<Product[]> {
    const items = await db.scan(PRODUCT_TABLE, {
      FilterExpression: 'brand = :brand',
      ExpressionAttributeValues: {
        ':brand': brand
      }
    });
    return items.map(item => new Product({
      ...item,
      isActive: item.isActive === 'true' || item.isActive === true
    } as any));
  }

  async save(product: Product): Promise<Product> {
    // Store isActive as string for GSI compatibility
    const itemToStore = {
      ...product,
      isActive: product.isActive ? 'true' : 'false'
    };
    await db.put(PRODUCT_TABLE, itemToStore);
    return product;
  }

  async activate(product: Product): Promise<Product> {
    product.activate();
    await db.update(PRODUCT_TABLE, { productId: product.productId }, {
      isActive: 'true', // Store as string for GSI
      updatedAt: product.updatedAt
    });
    return product;
  }

  async deactivate(product: Product): Promise<Product> {
    product.deactivate();
    await db.update(PRODUCT_TABLE, { productId: product.productId }, {
      isActive: 'false', // Store as string for GSI
      updatedAt: product.updatedAt
    });
    return product;
  }

  async updateImages(product: Product, imageUrl: string, thumbnailUrl: string): Promise<Product> {
    product.updateImages(imageUrl, thumbnailUrl);
    await db.update(PRODUCT_TABLE, { productId: product.productId }, {
      imageUrl: product.imageUrl,
      thumbnailUrl: product.thumbnailUrl,
      updatedAt: product.updatedAt
    });
    return product;
  }

  async updateContent(product: Product, termsAndConditions: string, howToRedeem: string): Promise<Product> {
    product.updateContent(termsAndConditions, howToRedeem);
    await db.update(PRODUCT_TABLE, { productId: product.productId }, {
      termsAndConditions: product.termsAndConditions,
      howToRedeem: product.howToRedeem,
      updatedAt: product.updatedAt
    });
    return product;
  }

  // Business query methods
  async findIncompleteProducts(): Promise<Product[]> {
    const allProducts = await this.findAll();
    return allProducts.filter(product => !product.hasCompleteInfo);
  }

  async findProductsWithoutImages(): Promise<Product[]> {
    const allProducts = await this.findAll();
    return allProducts.filter(product => !product.hasImages);
  }

  async getProductStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<ProductCategory, number>;
    incomplete: number;
    withoutImages: number;
  }> {
    const allProducts = await this.findAll();
    
    const stats = {
      total: allProducts.length,
      active: 0,
      inactive: 0,
      byCategory: {
        [ProductCategory.FOOD_DELIVERY]: 0,
        [ProductCategory.SHOPPING]: 0,
        [ProductCategory.ENTERTAINMENT]: 0,
        [ProductCategory.TRAVEL]: 0,
        [ProductCategory.GAMING]: 0,
        [ProductCategory.OTHER]: 0
      },
      incomplete: 0,
      withoutImages: 0
    };
    
    allProducts.forEach(product => {
      if (product.isActive) {
        stats.active++;
      } else {
        stats.inactive++;
      }
      
      stats.byCategory[product.category]++;
      
      if (!product.hasCompleteInfo) {
        stats.incomplete++;
      }
      
      if (!product.hasImages) {
        stats.withoutImages++;
      }
    });
    
    return stats;
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const items = await db.scan(PRODUCT_TABLE, {
      FilterExpression: 'contains(#name, :searchTerm) OR contains(#brand, :searchTerm) OR contains(#description, :searchTerm)',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#brand': 'brand',
        '#description': 'description'
      },
      ExpressionAttributeValues: {
        ':searchTerm': lowerSearchTerm
      }
    });
    
    return items.map(item => new Product({
      ...item,
      isActive: item.isActive === 'true' || item.isActive === true
    } as any));
  }

  async delete(product: Product): Promise<void> {
    await db.delete(PRODUCT_TABLE, { productId: product.productId });
  }
}

export const productRepository = new ProductRepository(); 