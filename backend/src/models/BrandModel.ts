export interface BrandVariant {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  description: string;
  vouchersSold: number;
  stockQuantity?: number;
  isActive?: boolean;
}

export class Brand {
  readonly brandId: string;
  readonly createdAt: string;
  
  name: string;
  logo: string;
  category: string;
  description: string;
  vouchersSold: number;
  popularity: number;
  variants: BrandVariant[];
  isActive: boolean;
  termsAndConditions?: string;
  howToRedeem?: string;
  updatedAt: string;

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
    this.validateRequiredFields(data);
    
    this.brandId = data.brandId;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    this.name = this.validateName(data.name);
    this.logo = data.logo;
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

  getVariant(variantId: string): BrandVariant | undefined {
    return this.variants.find(v => v.id === variantId);
  }

  getActiveVariants(): BrandVariant[] {
    return this.variants.filter(v => v.isActive !== false);
  }

  static fromDynamoDBItem(item: any): Brand {
    return new Brand(item);
  }

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

export const BRAND_TABLE = process.env.BRAND_TABLE as string;
