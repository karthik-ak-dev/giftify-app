import { ulid } from 'ulid';

// Product category enum for type safety
export enum ProductCategory {
  FOOD_DELIVERY = 'FOOD_DELIVERY',
  SHOPPING = 'SHOPPING',
  ENTERTAINMENT = 'ENTERTAINMENT',
  TRAVEL = 'TRAVEL',
  GAMING = 'GAMING',
  OTHER = 'OTHER'
}

// Product class - exact DynamoDB item structure with constructor and methods
export class Product {
  readonly productId: string;        // ULID - Primary Key (immutable)
  readonly createdAt: string;        // ISO timestamp (immutable)
  
  name: string;
  description: string;
  brand: string;
  category: ProductCategory;
  imageUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  termsAndConditions: string;
  howToRedeem: string;
  updatedAt: string;                 // ISO timestamp

  constructor(data: {
    productId: string;
    name: string;
    description: string;
    brand: string;
    category: ProductCategory;
    imageUrl: string;
    thumbnailUrl: string;
    isActive?: boolean;
    termsAndConditions: string;
    howToRedeem: string;
    createdAt?: string;
    updatedAt?: string;
  }) {
    // Validate required fields
    this.validateRequiredFields(data);
    
    // Immutable fields
    this.productId = data.productId;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    // Mutable fields
    this.name = this.validateName(data.name);
    this.description = this.validateDescription(data.description);
    this.brand = this.validateBrand(data.brand);
    this.category = data.category;
    this.imageUrl = this.validateUrl(data.imageUrl, 'image URL');
    this.thumbnailUrl = this.validateUrl(data.thumbnailUrl, 'thumbnail URL');
    this.isActive = data.isActive ?? true;
    this.termsAndConditions = this.validateText(data.termsAndConditions, 'terms and conditions');
    this.howToRedeem = this.validateText(data.howToRedeem, 'how to redeem');
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
  }

  // Create new product instance with validation
  static create(data: {
    name: string;
    description: string;
    brand: string;
    category: ProductCategory;
    imageUrl: string;
    thumbnailUrl: string;
    termsAndConditions: string;
    howToRedeem: string;
  }): Product {
    return new Product({
      productId: ulid(),
      ...data
    });
  }

  // Update product data with validation
  update(data: Partial<{
    name: string;
    description: string;
    brand: string;
    category: ProductCategory;
    imageUrl: string;
    thumbnailUrl: string;
    isActive: boolean;
    termsAndConditions: string;
    howToRedeem: string;
  }>): Product {
    const updates: any = {};
    
    if (data.name !== undefined) {
      updates.name = this.validateName(data.name);
    }
    if (data.description !== undefined) {
      updates.description = this.validateDescription(data.description);
    }
    if (data.brand !== undefined) {
      updates.brand = this.validateBrand(data.brand);
    }
    if (data.category !== undefined) {
      updates.category = data.category;
    }
    if (data.imageUrl !== undefined) {
      updates.imageUrl = this.validateUrl(data.imageUrl, 'image URL');
    }
    if (data.thumbnailUrl !== undefined) {
      updates.thumbnailUrl = this.validateUrl(data.thumbnailUrl, 'thumbnail URL');
    }
    if (data.isActive !== undefined) {
      updates.isActive = data.isActive;
    }
    if (data.termsAndConditions !== undefined) {
      updates.termsAndConditions = this.validateText(data.termsAndConditions, 'terms and conditions');
    }
    if (data.howToRedeem !== undefined) {
      updates.howToRedeem = this.validateText(data.howToRedeem, 'how to redeem');
    }

    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Status operations
  activate(): Product {
    return this.update({ isActive: true });
  }

  deactivate(): Product {
    return this.update({ isActive: false });
  }

  // Update specific fields
  updateImages(imageUrl: string, thumbnailUrl: string): Product {
    return this.update({ imageUrl, thumbnailUrl });
  }

  updateContent(termsAndConditions: string, howToRedeem: string): Product {
    return this.update({ termsAndConditions, howToRedeem });
  }

  // Computed properties
  get displayName(): string {
    return `${this.brand} ${this.name}`;
  }

  get categoryDisplayName(): string {
    return this.category.replace('_', ' ').toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  get hasImages(): boolean {
    return !!this.imageUrl && !!this.thumbnailUrl;
  }

  get hasCompleteInfo(): boolean {
    return !!(this.name && this.description && this.brand && 
             this.termsAndConditions && this.howToRedeem && 
             this.imageUrl && this.thumbnailUrl);
  }

  // Get product summary
  getSummary(): {
    productId: string;
    displayName: string;
    brand: string;
    category: ProductCategory;
    categoryDisplayName: string;
    isActive: boolean;
    hasCompleteInfo: boolean;
  } {
    return {
      productId: this.productId,
      displayName: this.displayName,
      brand: this.brand,
      category: this.category,
      categoryDisplayName: this.categoryDisplayName,
      isActive: this.isActive,
      hasCompleteInfo: this.hasCompleteInfo
    };
  }

  // Private validation methods
  private validateRequiredFields(data: any): void {
    const required = [
      'productId', 'name', 'description', 'brand', 'category',
      'imageUrl', 'thumbnailUrl', 'termsAndConditions', 'howToRedeem'
    ];
    
    for (const field of required) {
      if (data[field] === undefined || data[field] === null) {
        throw new Error(`${field} is required`);
      }
    }
  }

  private validateName(name: string): string {
    if (!name || name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (name.length > 100) {
      throw new Error('Product name cannot exceed 100 characters');
    }
    return name.trim();
  }

  private validateDescription(description: string): string {
    if (!description || description.trim().length === 0) {
      throw new Error('Product description cannot be empty');
    }
    if (description.length > 1000) {
      throw new Error('Product description cannot exceed 1000 characters');
    }
    return description.trim();
  }

  private validateBrand(brand: string): string {
    if (!brand || brand.trim().length === 0) {
      throw new Error('Product brand cannot be empty');
    }
    if (brand.length > 50) {
      throw new Error('Product brand cannot exceed 50 characters');
    }
    return brand.trim();
  }

  private validateUrl(url: string, fieldName: string): string {
    if (!url || url.trim().length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }
    
    try {
      new URL(url);
    } catch {
      throw new Error(`${fieldName} must be a valid URL`);
    }
    
    return url.trim();
  }

  private validateText(text: string, fieldName: string): string {
    if (!text || text.trim().length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }
    if (text.length > 5000) {
      throw new Error(`${fieldName} cannot exceed 5000 characters`);
    }
    return text.trim();
  }
}

// Table configuration
export const PRODUCT_TABLE = process.env.PRODUCTS_TABLE || 'giftify-products';
export const ACTIVE_PRODUCTS_GSI = 'ActiveProductsIndex'; 