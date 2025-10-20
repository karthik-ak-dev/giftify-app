import { ulid } from 'ulid';

// Brand variant interface
export interface BrandVariant {
  id: string;                    // Variant ID (e.g., 'amazon-500')
  name: string;                  // Display name (e.g., '₹500 Gift Card')
  originalPrice: number;         // MRP in rupees
  salePrice: number;             // Selling price in rupees
  discountPercent: number;       // Discount percentage
  description: string;           // Variant description
  vouchersSold: number;          // Number of vouchers sold for this variant
  stockQuantity?: number;        // Available stock (optional)
  isActive?: boolean;            // Whether variant is active
}

// Brand class - matches frontend structure with DynamoDB support
export class Brand {
  readonly brandId: string;          // Primary Key - ULID (immutable)
  readonly createdAt: string;        // ISO timestamp (immutable)
  
  name: string;                      // Brand name (e.g., 'Amazon')
  logo: string;                      // Logo URL or base64 encoded SVG
  category: string;                  // Category (e.g., 'E-commerce', 'Food & Dining')
  description: string;               // Brand description
  vouchersSold: number;              // Total vouchers sold for this brand
  popularity: number;                // Popularity ranking (higher = more popular)
  variants: BrandVariant[];          // Array of variants
  isActive: boolean;                 // Whether brand is active
  termsAndConditions?: string;       // Terms and conditions
  howToRedeem?: string;              // Redemption instructions
  updatedAt: string;                 // ISO timestamp

  constructor(data: {
    brandId: string;
    name: string;
    logo: string;
    category: string;
    description: string;
    vouchersSold?: number;
    popularity?: number;
    variants: BrandVariant[];
    isActive?: boolean;
    termsAndConditions?: string;
    howToRedeem?: string;
    createdAt?: string;
    updatedAt?: string;
  }) {
    // Validate required fields
    this.validateRequiredFields(data);
    
    // Immutable fields
    this.brandId = data.brandId;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    // Mutable fields
    this.name = this.validateName(data.name);
    this.logo = data.logo; // Can be URL or base64
    this.category = this.validateCategory(data.category);
    this.description = this.validateDescription(data.description);
    this.vouchersSold = data.vouchersSold ?? 0;
    this.popularity = data.popularity ?? 0;
    this.variants = this.validateVariants(data.variants);
    this.isActive = data.isActive ?? true;
    this.termsAndConditions = data.termsAndConditions ?? '';
    this.howToRedeem = data.howToRedeem ?? '';
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
  }

  // Create new brand instance with validation
  static create(data: {
    name: string;
    logo: string;
    category: string;
    description: string;
    variants: BrandVariant[];
    popularity?: number;
    termsAndConditions?: string;
    howToRedeem?: string;
  }): Brand {
    return new Brand({
      brandId: ulid(),
      ...data
    });
  }

  // Update brand data with validation
  update(data: Partial<{
    name: string;
    logo: string;
    category: string;
    description: string;
    popularity: number;
    isActive: boolean;
    termsAndConditions: string;
    howToRedeem: string;
  }>): Brand {
    if (data.name !== undefined) {
      this.name = this.validateName(data.name);
    }
    if (data.logo !== undefined) {
      this.logo = data.logo;
    }
    if (data.category !== undefined) {
      this.category = this.validateCategory(data.category);
    }
    if (data.description !== undefined) {
      this.description = this.validateDescription(data.description);
    }
    if (data.popularity !== undefined) {
      this.popularity = data.popularity;
    }
    if (data.isActive !== undefined) {
      this.isActive = data.isActive;
    }
    if (data.termsAndConditions !== undefined) {
      this.termsAndConditions = data.termsAndConditions;
    }
    if (data.howToRedeem !== undefined) {
      this.howToRedeem = data.howToRedeem;
    }
    
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Add a new variant
  addVariant(variant: BrandVariant): Brand {
    const validatedVariant = this.validateVariant(variant);
    
    // Check if variant ID already exists
    if (this.variants.some(v => v.id === validatedVariant.id)) {
      throw new Error(`Variant with ID ${validatedVariant.id} already exists`);
    }
    
    this.variants.push(validatedVariant);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Update a variant
  updateVariant(variantId: string, data: Partial<BrandVariant>): Brand {
    const variantIndex = this.variants.findIndex(v => v.id === variantId);
    if (variantIndex === -1) {
      throw new Error(`Variant with ID ${variantId} not found`);
    }
    
    const updatedVariant = { ...this.variants[variantIndex], ...data };
    this.variants[variantIndex] = this.validateVariant(updatedVariant);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Remove a variant
  removeVariant(variantId: string): Brand {
    const initialLength = this.variants.length;
    this.variants = this.variants.filter(v => v.id !== variantId);
    
    if (this.variants.length === initialLength) {
      throw new Error(`Variant with ID ${variantId} not found`);
    }
    
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Get a variant by ID
  getVariant(variantId: string): BrandVariant | undefined {
    return this.variants.find(v => v.id === variantId);
  }

  // Get active variants only
  getActiveVariants(): BrandVariant[] {
    return this.variants.filter(v => v.isActive !== false);
  }

  // Recalculate total vouchers sold from variants
  recalculateVouchersSold(): Brand {
    this.vouchersSold = this.variants.reduce((total, variant) => {
      return total + (variant.vouchersSold || 0);
    }, 0);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Convert to plain object for DynamoDB
  toDynamoDBItem(): Record<string, any> {
    return {
      brandId: this.brandId,
      name: this.name,
      logo: this.logo,
      category: this.category,
      description: this.description,
      vouchersSold: this.vouchersSold,
      popularity: this.popularity,
      variants: this.variants,
      isActive: this.isActive,
      termsAndConditions: this.termsAndConditions,
      howToRedeem: this.howToRedeem,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from DynamoDB item
  static fromDynamoDBItem(item: any): Brand {
    return new Brand(item);
  }

  // Validation methods
  private validateRequiredFields(data: any): void {
    const required = ['brandId', 'name', 'logo', 'category', 'description', 'variants'];
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`${field} is required`);
      }
    }
  }

  private validateName(name: string): string {
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Brand name must be a non-empty string');
    }
    if (name.length > 100) {
      throw new Error('Brand name must not exceed 100 characters');
    }
    return name.trim();
  }

  private validateCategory(category: string): string {
    if (typeof category !== 'string' || category.trim().length === 0) {
      throw new Error('Category must be a non-empty string');
    }
    if (category.length > 50) {
      throw new Error('Category must not exceed 50 characters');
    }
    return category.trim();
  }

  private validateDescription(description: string): string {
    if (typeof description !== 'string' || description.trim().length === 0) {
      throw new Error('Description must be a non-empty string');
    }
    if (description.length > 500) {
      throw new Error('Description must not exceed 500 characters');
    }
    return description.trim();
  }

  private validateVariants(variants: BrandVariant[]): BrandVariant[] {
    if (!Array.isArray(variants) || variants.length === 0) {
      throw new Error('Brand must have at least one variant');
    }
    return variants.map(v => this.validateVariant(v));
  }

  private validateVariant(variant: BrandVariant): BrandVariant {
    const required = ['id', 'name', 'originalPrice', 'salePrice', 'discountPercent', 'description'];
    for (const field of required) {
      if (variant[field as keyof BrandVariant] === undefined) {
        throw new Error(`Variant ${field} is required`);
      }
    }

    if (variant.originalPrice <= 0) {
      throw new Error('Original price must be positive');
    }
    if (variant.salePrice <= 0) {
      throw new Error('Sale price must be positive');
    }
    if (variant.salePrice > variant.originalPrice) {
      throw new Error('Sale price cannot be greater than original price');
    }
    if (variant.discountPercent < 0 || variant.discountPercent > 100) {
      throw new Error('Discount percent must be between 0 and 100');
    }
    if (variant.stockQuantity !== undefined && variant.stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }

    return {
      ...variant,
      vouchersSold: variant.vouchersSold || 0,
      isActive: variant.isActive !== undefined ? variant.isActive : true
    };
  }
}

// Table configuration
export const BRAND_TABLE = process.env.BRAND_TABLE || 'giftify-brands';

