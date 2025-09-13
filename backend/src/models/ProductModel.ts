import { Product } from '../types/product';

export class ProductModel {
  static readonly tableName = process.env.PRODUCTS_TABLE || 'giftify-products';
  
  // Primary Key
  static readonly partitionKey = 'productId';
  
  // GSI Keys
  static readonly activeProductsGSI = 'ActiveProductsIndex';
  static readonly activeProductsGSIPartitionKey = 'isActive';
  static readonly activeProductsGSISortKey = 'name';
  
  // Table schema definition
  static readonly schema = {
    productId: 'string',        // ULID - Primary Key
    name: 'string',             // GSI Sort Key
    description: 'string',
    brand: 'string',
    category: 'string',
    imageUrl: 'string',
    thumbnailUrl: 'string',
    isActive: 'string',         // GSI Partition Key (stored as string for GSI)
    termsAndConditions: 'string',
    howToRedeem: 'string',
    createdAt: 'string',        // ISO timestamp
    updatedAt: 'string'         // ISO timestamp
  };
  
  // Default values
  static readonly defaults = {
    isActive: 'true'
  };
  
  // Validation rules
  static readonly validation = {
    name: {
      required: true,
      minLength: 1,
      maxLength: 100
    },
    brand: {
      required: true,
      minLength: 1,
      maxLength: 50
    },
    category: {
      required: true,
      enum: ['FOOD_DELIVERY', 'SHOPPING', 'ENTERTAINMENT', 'TRAVEL', 'GAMING', 'OTHER']
    }
  };
  
  // Transform DB item to Product interface
  static toProduct(item: any): Product {
    return {
      productId: item.productId,
      name: item.name,
      description: item.description,
      brand: item.brand,
      category: item.category,
      imageUrl: item.imageUrl,
      thumbnailUrl: item.thumbnailUrl,
      isActive: item.isActive === 'true',
      termsAndConditions: item.termsAndConditions,
      howToRedeem: item.howToRedeem,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }
} 