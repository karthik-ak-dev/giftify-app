import { PutCommand, GetCommand, DeleteCommand, ScanCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ProductVariant, PRODUCT_VARIANT_TABLE, VARIANT_ID_GSI } from '../models/ProductVariantModel';
import { docClient } from '../utils/database';

export class ProductVariantRepository {
  async create(variant: ProductVariant): Promise<ProductVariant> {
    const command = new PutCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      Item: variant,
      ConditionExpression: 'attribute_not_exists(productId) AND attribute_not_exists(variantId)' // Prevent overwriting existing variant
    });
    
    try {
      await docClient.send(command);
      return variant;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Product variant already exists');
      }
      throw error;
    }
  }

  async findById(variantId: string): Promise<ProductVariant | null> {
    const command = new QueryCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      IndexName: VARIANT_ID_GSI,
      KeyConditionExpression: 'variantId = :variantId',
      ExpressionAttributeValues: {
        ':variantId': variantId
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items && result.Items.length > 0) ? new ProductVariant(result.Items[0] as any) : null;
  }

  async findByProductId(productId: string): Promise<ProductVariant[]> {
    const command = new QueryCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      KeyConditionExpression: 'productId = :productId',
      ExpressionAttributeValues: {
        ':productId': productId
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new ProductVariant(item as any));
  }

  async findActiveByProductId(productId: string): Promise<ProductVariant[]> {
    const command = new QueryCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      KeyConditionExpression: 'productId = :productId',
      FilterExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':productId': productId,
        ':active': true
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new ProductVariant(item as any));
  }

  async save(variant: ProductVariant): Promise<ProductVariant> {
    variant.update({}); // This updates the updatedAt timestamp
    
    const command = new PutCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      Item: variant
    });
    
    await docClient.send(command);
    return variant;
  }

  async updateStock(variant: ProductVariant, newStock: number): Promise<ProductVariant> {
    variant.update({ stockQuantity: newStock });
    
    const command = new UpdateCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      Key: { 
        productId: variant.productId, 
        variantId: variant.variantId 
      },
      UpdateExpression: 'SET stockQuantity = :stock, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':stock': variant.stockQuantity,
        ':updatedAt': variant.updatedAt
      },
      ConditionExpression: 'attribute_exists(productId) AND attribute_exists(variantId)' // Ensure variant exists
    });
    
    try {
      await docClient.send(command);
      return variant;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Product variant not found');
      }
      throw error;
    }
  }

  async addStock(variant: ProductVariant, quantity: number): Promise<ProductVariant> {
    variant.addStock(quantity);
    
    const command = new UpdateCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      Key: { 
        productId: variant.productId, 
        variantId: variant.variantId 
      },
      UpdateExpression: 'ADD stockQuantity :quantity SET updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':quantity': quantity,
        ':updatedAt': variant.updatedAt
      },
      ConditionExpression: 'attribute_exists(productId) AND attribute_exists(variantId)' // Ensure variant exists
    });
    
    try {
      await docClient.send(command);
      return variant;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Product variant not found');
      }
      throw error;
    }
  }

  async reduceStock(variant: ProductVariant, quantity: number): Promise<ProductVariant> {
    variant.reduceStock(quantity);
    
    const command = new UpdateCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      Key: { 
        productId: variant.productId, 
        variantId: variant.variantId 
      },
      UpdateExpression: 'ADD stockQuantity :negQuantity SET updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':negQuantity': -quantity,
        ':updatedAt': variant.updatedAt
      },
      ConditionExpression: 'attribute_exists(productId) AND attribute_exists(variantId) AND stockQuantity >= :minStock',
      ExpressionAttributeNames: {}
    });
    
    // Add minimum stock condition
    command.input.ExpressionAttributeValues![':minStock'] = quantity;
    
    try {
      await docClient.send(command);
      return variant;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Product variant not found or insufficient stock');
      }
      throw error;
    }
  }

  async activate(variant: ProductVariant): Promise<ProductVariant> {
    variant.activate();
    
    const command = new UpdateCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      Key: { 
        productId: variant.productId, 
        variantId: variant.variantId 
      },
      UpdateExpression: 'SET isActive = :active, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':active': variant.isActive,
        ':updatedAt': variant.updatedAt
      },
      ConditionExpression: 'attribute_exists(productId) AND attribute_exists(variantId)' // Ensure variant exists
    });
    
    try {
      await docClient.send(command);
      return variant;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Product variant not found');
      }
      throw error;
    }
  }

  async deactivate(variant: ProductVariant): Promise<ProductVariant> {
    variant.deactivate();
    
    const command = new UpdateCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      Key: { 
        productId: variant.productId, 
        variantId: variant.variantId 
      },
      UpdateExpression: 'SET isActive = :inactive, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':inactive': variant.isActive,
        ':updatedAt': variant.updatedAt
      },
      ConditionExpression: 'attribute_exists(productId) AND attribute_exists(variantId)' // Ensure variant exists
    });
    
    try {
      await docClient.send(command);
      return variant;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Product variant not found');
      }
      throw error;
    }
  }

  // Business query methods with optimized scans
  async findLowStockVariants(threshold?: number): Promise<ProductVariant[]> {
    const command = new ScanCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      FilterExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':active': true
      }
    });
    
    const result = await docClient.send(command);
    const variants = (result.Items || []).map(item => new ProductVariant(item as any));
    
    return variants.filter(variant => 
      threshold ? variant.stockQuantity <= threshold : variant.hasLowStock
    );
  }

  async findOutOfStockVariants(): Promise<ProductVariant[]> {
    const command = new ScanCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      FilterExpression: 'isActive = :active AND stockQuantity = :zero',
      ExpressionAttributeValues: {
        ':active': true,
        ':zero': 0
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new ProductVariant(item as any));
  }

  async findInStockVariants(): Promise<ProductVariant[]> {
    const command = new ScanCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      FilterExpression: 'isActive = :active AND stockQuantity > :zero',
      ExpressionAttributeValues: {
        ':active': true,
        ':zero': 0
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new ProductVariant(item as any));
  }

  // Advanced query methods
  async findVariantsByPriceRange(minPrice: number, maxPrice: number): Promise<ProductVariant[]> {
    const command = new ScanCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      FilterExpression: 'sellingPrice BETWEEN :minPrice AND :maxPrice AND isActive = :active',
      ExpressionAttributeValues: {
        ':minPrice': minPrice,
        ':maxPrice': maxPrice,
        ':active': true
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new ProductVariant(item as any));
  }

  async findVariantsByDenomination(denomination: number): Promise<ProductVariant[]> {
    const command = new ScanCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      FilterExpression: 'denomination = :denomination AND isActive = :active',
      ExpressionAttributeValues: {
        ':denomination': denomination,
        ':active': true
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => new ProductVariant(item as any));
  }

  async getStockStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    inStock: number;
    outOfStock: number;
    lowStock: number;
    totalStockValue: number;
  }> {
    const command = new ScanCommand({
      TableName: PRODUCT_VARIANT_TABLE
    });
    
    const result = await docClient.send(command);
    const variants = (result.Items || []).map(item => new ProductVariant(item as any));
    
    const stats = {
      total: variants.length,
      active: 0,
      inactive: 0,
      inStock: 0,
      outOfStock: 0,
      lowStock: 0,
      totalStockValue: 0
    };
    
    variants.forEach(variant => {
      if (variant.isActive) {
        stats.active++;
        
        if (variant.isInStock) {
          stats.inStock++;
        } else if (variant.isOutOfStock) {
          stats.outOfStock++;
        }
        
        if (variant.hasLowStock) {
          stats.lowStock++;
        }
        
        stats.totalStockValue += variant.stockQuantity * variant.costPrice;
      } else {
        stats.inactive++;
      }
    });
    
    return stats;
  }

  // Batch operations for better performance
  async atomicStockReduction(updates: Array<{ variantId: string; quantity: number }>): Promise<ProductVariant[]> {
    const updatedVariants: ProductVariant[] = [];
    
    // Process each update atomically
    for (const update of updates) {
      const variant = await this.findById(update.variantId);
      if (!variant) {
        throw new Error(`Product variant not found: ${update.variantId}`);
      }
      
      const updatedVariant = await this.reduceStock(variant, update.quantity);
      updatedVariants.push(updatedVariant);
    }
    
    return updatedVariants;
  }

  async delete(variant: ProductVariant): Promise<void> {
    const command = new DeleteCommand({
      TableName: PRODUCT_VARIANT_TABLE,
      Key: { 
        productId: variant.productId, 
        variantId: variant.variantId 
      },
      ConditionExpression: 'isActive = :inactive AND stockQuantity = :zero', // Only delete inactive variants with no stock
      ExpressionAttributeValues: {
        ':inactive': false,
        ':zero': 0
      }
    });
    
    try {
      await docClient.send(command);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Cannot delete active variants or variants with stock. Deactivate and clear stock first.');
      }
      throw error;
    }
  }
}

export const productVariantRepository = new ProductVariantRepository(); 