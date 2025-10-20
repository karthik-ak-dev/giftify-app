import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { Brand, BRAND_TABLE } from '../models/BrandModel';
import { docClient } from '../utils/database';

/**
 * Brand Repository - Simplified
 * Contains only the methods actually used by the application
 */
export class BrandRepository {
  /**
   * Find all active brands
   * Used by: getBrandsService
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
   * Find brand with variant details by variant ID
   * Used by: cart services, order services
   */
  async findByVariantId(variantId: string): Promise<{ brand: Brand; variant: any } | null> {
    const brands = await this.findAllActive();
    
    for (const brand of brands) {
      const variant = brand.getVariant(variantId);
      if (variant) {
        return { brand, variant };
      }
    }
    
    return null;
  }
}

// Singleton instance
export const brandRepository = new BrandRepository();
