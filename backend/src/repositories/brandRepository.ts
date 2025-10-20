import { PutCommand, GetCommand, DeleteCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Brand, BRAND_TABLE } from '../models/BrandModel';
import { docClient } from '../utils/database';

export class BrandRepository {
  /**
   * Create a new brand
   */
  async create(brand: Brand): Promise<Brand> {
    const command = new PutCommand({
      TableName: BRAND_TABLE,
      Item: brand.toDynamoDBItem(),
      ConditionExpression: 'attribute_not_exists(brandId)' // Prevent overwriting existing brand
    });
    
    try {
      await docClient.send(command);
      return brand;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Brand already exists');
      }
      throw error;
    }
  }

  /**
   * Find brand by ID
   */
  async findById(brandId: string): Promise<Brand | null> {
    const command = new GetCommand({
      TableName: BRAND_TABLE,
      Key: { brandId }
    });
    
    const result = await docClient.send(command);
    if (!result.Item) return null;
    
    return Brand.fromDynamoDBItem(result.Item);
  }

  /**
   * Find all brands
   */
  async findAll(): Promise<Brand[]> {
    const command = new ScanCommand({
      TableName: BRAND_TABLE
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => Brand.fromDynamoDBItem(item));
  }

  /**
   * Find all active brands
   */
  async findAllActive(): Promise<Brand[]> {
    const command = new ScanCommand({
      TableName: BRAND_TABLE,
      FilterExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':active': true
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => Brand.fromDynamoDBItem(item));
  }

  /**
   * Find brands by category
   */
  async findByCategory(category: string): Promise<Brand[]> {
    const command = new ScanCommand({
      TableName: BRAND_TABLE,
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => Brand.fromDynamoDBItem(item));
  }

  /**
   * Find active brands by category
   */
  async findActiveBrandsByCategory(category: string): Promise<Brand[]> {
    const command = new ScanCommand({
      TableName: BRAND_TABLE,
      FilterExpression: 'category = :category AND isActive = :active',
      ExpressionAttributeValues: {
        ':category': category,
        ':active': true
      }
    });
    
    const result = await docClient.send(command);
    return (result.Items || []).map(item => Brand.fromDynamoDBItem(item));
  }

  /**
   * Find brands by popularity (sorted by popularity score)
   */
  async findPopular(limit: number = 10): Promise<Brand[]> {
    const brands = await this.findAllActive();
    
    // Sort by popularity (higher is better) and take top N
    return brands
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }

  /**
   * Find brands sorted by vouchers sold
   */
  async findBestSelling(limit: number = 10): Promise<Brand[]> {
    const brands = await this.findAllActive();
    
    // Sort by vouchers sold (higher is better) and take top N
    return brands
      .sort((a, b) => b.vouchersSold - a.vouchersSold)
      .slice(0, limit);
  }

  /**
   * Search brands by name (case-insensitive)
   */
  async searchByName(searchTerm: string): Promise<Brand[]> {
    const brands = await this.findAllActive();
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return brands.filter(brand => 
      brand.name.toLowerCase().includes(lowerSearchTerm)
    );
  }

  /**
   * Update brand
   */
  async update(brand: Brand): Promise<Brand> {
    const command = new PutCommand({
      TableName: BRAND_TABLE,
      Item: brand.toDynamoDBItem()
    });
    
    await docClient.send(command);
    return brand;
  }

  /**
   * Update specific brand fields
   */
  async updateFields(brandId: string, updates: {
    name?: string;
    logo?: string;
    category?: string;
    description?: string;
    popularity?: number;
    isActive?: boolean;
    termsAndConditions?: string;
    howToRedeem?: string;
  }): Promise<Brand> {
    const brand = await this.findById(brandId);
    if (!brand) {
      throw new Error('Brand not found');
    }

    brand.update(updates);
    return this.update(brand);
  }

  /**
   * Update brand variant
   */
  async updateVariant(brandId: string, variantId: string, updates: {
    name?: string;
    originalPrice?: number;
    salePrice?: number;
    discountPercent?: number;
    description?: string;
    stockQuantity?: number;
    isActive?: boolean;
  }): Promise<Brand> {
    const brand = await this.findById(brandId);
    if (!brand) {
      throw new Error('Brand not found');
    }

    brand.updateVariant(variantId, updates);
    return this.update(brand);
  }

  /**
   * Add variant to brand
   */
  async addVariant(brandId: string, variant: {
    id: string;
    name: string;
    originalPrice: number;
    salePrice: number;
    discountPercent: number;
    description: string;
    vouchersSold: number;
    stockQuantity?: number;
    isActive?: boolean;
  }): Promise<Brand> {
    const brand = await this.findById(brandId);
    if (!brand) {
      throw new Error('Brand not found');
    }

    brand.addVariant(variant);
    return this.update(brand);
  }

  /**
   * Remove variant from brand
   */
  async removeVariant(brandId: string, variantId: string): Promise<Brand> {
    const brand = await this.findById(brandId);
    if (!brand) {
      throw new Error('Brand not found');
    }

    brand.removeVariant(variantId);
    return this.update(brand);
  }

  /**
   * Get brand with variant details by variant ID
   */
  async findByVariantId(variantId: string): Promise<{ brand: Brand; variant: any } | null> {
    const brands = await this.findAll();
    
    for (const brand of brands) {
      const variant = brand.getVariant(variantId);
      if (variant) {
        return { brand, variant };
      }
    }
    
    return null;
  }

  /**
   * Increment vouchers sold for a variant
   */
  async incrementVouchersSold(brandId: string, variantId: string, quantity: number = 1): Promise<Brand> {
    const brand = await this.findById(brandId);
    if (!brand) {
      throw new Error('Brand not found');
    }

    const variant = brand.getVariant(variantId);
    if (!variant) {
      throw new Error('Variant not found');
    }

    // Update variant vouchers sold
    variant.vouchersSold = (variant.vouchersSold || 0) + quantity;
    brand.updateVariant(variantId, { vouchersSold: variant.vouchersSold });
    
    // Recalculate total brand vouchers sold
    brand.recalculateVouchersSold();
    
    return this.update(brand);
  }

  /**
   * Delete brand
   */
  async delete(brandId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: BRAND_TABLE,
      Key: { brandId }
    });
    
    await docClient.send(command);
  }

  /**
   * Soft delete (mark as inactive)
   */
  async softDelete(brandId: string): Promise<Brand> {
    return this.updateFields(brandId, { isActive: false });
  }

  /**
   * Check if variant has sufficient stock
   */
  async checkVariantStock(brandId: string, variantId: string, requestedQuantity: number): Promise<boolean> {
    const brand = await this.findById(brandId);
    if (!brand) return false;

    const variant = brand.getVariant(variantId);
    if (!variant) return false;

    // If stock quantity is not defined, assume unlimited stock
    if (variant.stockQuantity === undefined) return true;

    return variant.stockQuantity >= requestedQuantity;
  }

  /**
   * Decrease variant stock quantity
   */
  async decreaseStock(brandId: string, variantId: string, quantity: number): Promise<Brand> {
    const brand = await this.findById(brandId);
    if (!brand) {
      throw new Error('Brand not found');
    }

    const variant = brand.getVariant(variantId);
    if (!variant) {
      throw new Error('Variant not found');
    }

    // If stock quantity is defined, decrease it
    if (variant.stockQuantity !== undefined) {
      if (variant.stockQuantity < quantity) {
        throw new Error('Insufficient stock');
      }
      variant.stockQuantity -= quantity;
      brand.updateVariant(variantId, { stockQuantity: variant.stockQuantity });
    }

    return this.update(brand);
  }

  /**
   * Increase variant stock quantity (e.g., for order cancellation)
   */
  async increaseStock(brandId: string, variantId: string, quantity: number): Promise<Brand> {
    const brand = await this.findById(brandId);
    if (!brand) {
      throw new Error('Brand not found');
    }

    const variant = brand.getVariant(variantId);
    if (!variant) {
      throw new Error('Variant not found');
    }

    // If stock quantity is defined, increase it
    if (variant.stockQuantity !== undefined) {
      variant.stockQuantity += quantity;
      brand.updateVariant(variantId, { stockQuantity: variant.stockQuantity });
    }

    return this.update(brand);
  }

  /**
   * Get all categories (distinct)
   */
  async getAllCategories(): Promise<string[]> {
    const brands = await this.findAll();
    const categories = new Set(brands.map(brand => brand.category));
    return Array.from(categories).sort();
  }

  /**
   * Batch get brands by IDs
   */
  async findByIds(brandIds: string[]): Promise<Brand[]> {
    const brands: Brand[] = [];
    
    // Note: For better performance, consider using BatchGetCommand
    // For now, using sequential gets for simplicity
    for (const brandId of brandIds) {
      const brand = await this.findById(brandId);
      if (brand) {
        brands.push(brand);
      }
    }
    
    return brands;
  }
}

// Singleton instance
export const brandRepository = new BrandRepository();

