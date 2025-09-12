import { ProductVariant } from '../types/product';

export class ProductVariantModel {
  static readonly tableName = process.env.PRODUCT_VARIANTS_TABLE || 'giftify-product-variants';
  
  // Primary Key
  static readonly partitionKey = 'productId';
  static readonly sortKey = 'variantId';
  
  // GSI Keys
  static readonly variantIdGSI = 'VariantIdIndex';
  static readonly variantIdGSIKey = 'variantId';
  
  static readonly activeVariantsGSI = 'ActiveVariantsIndex';
  static readonly activeVariantsGSIPartitionKey = 'productId';
  static readonly activeVariantsGSISortKey = 'denomination';
  
  // Table schema definition
  static readonly schema = {
    productId: 'string',        // Partition Key
    variantId: 'string',        // Sort Key - ULID
    name: 'string',
    denomination: 'number',     // Face value in rupees - GSI2 Sort Key
    mrp: 'number',              // MRP in cents/paise
    costPrice: 'number',        // Cost price in cents/paise
    discountPercent: 'number',  // Discount percentage
    sellingPrice: 'number',     // Selling price in cents/paise
    stockQuantity: 'number',    // Available stock
    minOrderQuantity: 'number', // Minimum order quantity
    maxOrderQuantity: 'number', // Maximum order quantity
    isActive: 'string',         // Stored as string for GSI filtering
    createdAt: 'string',        // ISO timestamp
    updatedAt: 'string'         // ISO timestamp
  };
  
  // Default values
  static readonly defaults = {
    minOrderQuantity: 1,
    maxOrderQuantity: 10,
    isActive: 'true',
    stockQuantity: 0
  };
  
  // Validation rules
  static readonly validation = {
    name: {
      required: true,
      minLength: 1,
      maxLength: 100
    },
    denomination: {
      required: true,
      min: 1
    },
    mrp: {
      required: true,
      min: 1
    },
    costPrice: {
      required: true,
      min: 1
    },
    sellingPrice: {
      required: true,
      min: 1
    },
    stockQuantity: {
      required: true,
      min: 0
    }
  };
  
  // Transform DB item to ProductVariant interface
  static toProductVariant(item: any): ProductVariant {
    return {
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      denomination: item.denomination,
      mrp: item.mrp,
      costPrice: item.costPrice,
      discountPercent: item.discountPercent,
      sellingPrice: item.sellingPrice,
      stockQuantity: item.stockQuantity,
      minOrderQuantity: item.minOrderQuantity,
      maxOrderQuantity: item.maxOrderQuantity,
      isActive: item.isActive === 'true',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }
} 