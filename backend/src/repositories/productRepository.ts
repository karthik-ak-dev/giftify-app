import { PutCommand, GetCommand, DeleteCommand, ScanCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Product, ProductCategory, PRODUCT_TABLE, ACTIVE_PRODUCTS_GSI } from '../models/ProductModel';
import { docClient } from '../utils/database';

export class ProductRepository {
  async create(product: Product): Promise<Product> {
    // Store isActive as string for GSI compatibility
    const itemToStore = {
      ...product,
      isActive: product.isActive ? 'true' : 'false'
    };
    
    const command = new PutCommand({
      TableName: PRODUCT_TABLE,
      Item: itemToStore,
      ConditionExpression: 'attribute_not_exists(productId)' // Prevent overwriting existing product
    });
    
    try {
      await docClient.send(command);
      return product;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Product already exists');
      }
      throw error;
    }
  }

  async findById(productId: string): Promise<Product | null> {
    const command = new GetCommand({
      TableName: PRODUCT_TABLE,
      Key: { productId }
    });
    
    const result = await docClient.send(command);
    if (!result.Item) return null;
    
    return new Product({
      ...result.Item,
      isActive: result.Item.isActive === 'true' || result.Item.isActive === true
    } as any);
  }

  async findAllActive(): Promise<Product[]> {
    // Query GSI for active products (isActive stored as string 'true' for GSI)
    const command = new QueryCommand({
      TableName: PRODUCT_TABLE,
      IndexName: ACTIVE_PRODUCTS_GSI,
      KeyConditionExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':active': 'true'
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new Product({
      ...item,
      isActive: true // We know these are active since we queried for them
    } as any));
  }

  async findAll(): Promise<Product[]> {
    const command = new ScanCommand({
      TableName: PRODUCT_TABLE
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new Product({
      ...item,
      isActive: item.isActive === 'true' || item.isActive === true
    } as any));
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    const command = new ScanCommand({
      TableName: PRODUCT_TABLE,
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new Product({
      ...item,
      isActive: item.isActive === 'true' || item.isActive === true
    } as any));
  }

  async findActiveByCategory(category: ProductCategory): Promise<Product[]> {
    const command = new ScanCommand({
      TableName: PRODUCT_TABLE,
      FilterExpression: 'category = :category AND isActive = :active',
      ExpressionAttributeValues: {
        ':category': category,
        ':active': 'true'
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new Product({
      ...item,
      isActive: true
    } as any));
  }

  async findByBrand(brand: string): Promise<Product[]> {
    const command = new ScanCommand({
      TableName: PRODUCT_TABLE,
      FilterExpression: 'brand = :brand',
      ExpressionAttributeValues: {
        ':brand': brand
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new Product({
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
    
    const command = new PutCommand({
      TableName: PRODUCT_TABLE,
      Item: itemToStore
    });
    
    await docClient.send(command);
    return product;
  }

  async activate(product: Product): Promise<Product> {
    product.activate();
    
    const command = new UpdateCommand({
      TableName: PRODUCT_TABLE,
      Key: { productId: product.productId },
      UpdateExpression: 'SET isActive = :active, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':active': 'true', // Store as string for GSI
        ':updatedAt': product.updatedAt
      },
      ConditionExpression: 'attribute_exists(productId)' // Ensure product exists
    });
    
    try {
      await docClient.send(command);
      return product;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Product not found');
      }
      throw error;
    }
  }

  async deactivate(product: Product): Promise<Product> {
    product.deactivate();
    
    const command = new UpdateCommand({
      TableName: PRODUCT_TABLE,
      Key: { productId: product.productId },
      UpdateExpression: 'SET isActive = :inactive, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':inactive': 'false', // Store as string for GSI
        ':updatedAt': product.updatedAt
      },
      ConditionExpression: 'attribute_exists(productId)' // Ensure product exists
    });
    
    try {
      await docClient.send(command);
      return product;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Product not found');
      }
      throw error;
    }
  }

  async updateImages(product: Product, imageUrl: string, thumbnailUrl: string): Promise<Product> {
    product.updateImages(imageUrl, thumbnailUrl);
    
    const command = new UpdateCommand({
      TableName: PRODUCT_TABLE,
      Key: { productId: product.productId },
      UpdateExpression: 'SET imageUrl = :imageUrl, thumbnailUrl = :thumbnailUrl, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':imageUrl': product.imageUrl,
        ':thumbnailUrl': product.thumbnailUrl,
        ':updatedAt': product.updatedAt
      },
      ConditionExpression: 'attribute_exists(productId)' // Ensure product exists
    });
    
    try {
      await docClient.send(command);
      return product;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Product not found');
      }
      throw error;
    }
  }

  async updateContent(product: Product, termsAndConditions: string, howToRedeem: string): Promise<Product> {
    product.updateContent(termsAndConditions, howToRedeem);
    
    const command = new UpdateCommand({
      TableName: PRODUCT_TABLE,
      Key: { productId: product.productId },
      UpdateExpression: 'SET termsAndConditions = :terms, howToRedeem = :howToRedeem, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':terms': product.termsAndConditions,
        ':howToRedeem': product.howToRedeem,
        ':updatedAt': product.updatedAt
      },
      ConditionExpression: 'attribute_exists(productId)' // Ensure product exists
    });
    
    try {
      await docClient.send(command);
      return product;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Product not found');
      }
      throw error;
    }
  }

  // Business query methods with optimized scans
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
    const command = new ScanCommand({
      TableName: PRODUCT_TABLE,
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
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new Product({
      ...item,
      isActive: item.isActive === 'true' || item.isActive === true
    } as any));
  }

  // Advanced query methods
  async findProductsByBrandAndCategory(brand: string, category: ProductCategory): Promise<Product[]> {
    const command = new ScanCommand({
      TableName: PRODUCT_TABLE,
      FilterExpression: 'brand = :brand AND category = :category',
      ExpressionAttributeValues: {
        ':brand': brand,
        ':category': category
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new Product({
      ...item,
      isActive: item.isActive === 'true' || item.isActive === true
    } as any));
  }

  async findRecentlyUpdatedProducts(daysBack: number = 7): Promise<Product[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    const cutoffISOString = cutoffDate.toISOString();
    
    const command = new ScanCommand({
      TableName: PRODUCT_TABLE,
      FilterExpression: 'updatedAt >= :cutoffDate',
      ExpressionAttributeValues: {
        ':cutoffDate': cutoffISOString
      }
    });
    
    const result = await docClient.send(command);
    const products = (result.Items || []).map(item => new Product({
      ...item,
      isActive: item.isActive === 'true' || item.isActive === true
    } as any));
    
    return products.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async delete(product: Product): Promise<void> {
    const command = new DeleteCommand({
      TableName: PRODUCT_TABLE,
      Key: { productId: product.productId },
      ConditionExpression: 'isActive = :inactive', // Only allow deleting inactive products
      ExpressionAttributeValues: {
        ':inactive': 'false'
      }
    });
    
    try {
      await docClient.send(command);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Cannot delete active products. Deactivate first.');
      }
      throw error;
    }
  }
}

export const productRepository = new ProductRepository(); 