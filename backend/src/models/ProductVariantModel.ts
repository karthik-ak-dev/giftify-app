import { ulid } from 'ulid';

// ProductVariant class - exact DynamoDB item structure with constructor and methods
export class ProductVariant {
  readonly productId: string;        // Partition Key (immutable)
  readonly variantId: string;        // Sort Key - ULID (immutable)
  readonly createdAt: string;        // ISO timestamp (immutable)
  
  name: string;
  denomination: number;              // Face value in rupees
  mrp: number;                      // MRP in cents/paise
  costPrice: number;                // Cost price in cents/paise
  discountPercent: number;          // Discount percentage
  sellingPrice: number;             // Selling price in cents/paise
  stockQuantity: number;            // Available stock
  minOrderQuantity: number;         // Minimum order quantity
  maxOrderQuantity: number;         // Maximum order quantity
  isActive: boolean;
  updatedAt: string;                // ISO timestamp

  constructor(data: {
    productId: string;
    variantId: string;
    name: string;
    denomination: number;
    mrp: number;
    costPrice: number;
    discountPercent: number;
    sellingPrice: number;
    stockQuantity?: number;
    minOrderQuantity?: number;
    maxOrderQuantity?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }) {
    // Validate required fields
    this.validateRequiredFields(data);
    
    // Immutable fields
    this.productId = data.productId;
    this.variantId = data.variantId;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    
    // Mutable fields
    this.name = this.validateName(data.name);
    this.denomination = this.validateDenomination(data.denomination);
    this.mrp = this.validatePrice(data.mrp, 'MRP');
    this.costPrice = this.validatePrice(data.costPrice, 'cost price');
    this.discountPercent = this.validateDiscountPercent(data.discountPercent);
    this.sellingPrice = this.validatePrice(data.sellingPrice, 'selling price');
    this.stockQuantity = this.validateStock(data.stockQuantity ?? 0);
    this.minOrderQuantity = this.validateOrderQuantity(data.minOrderQuantity ?? 1, 'minimum');
    this.maxOrderQuantity = this.validateOrderQuantity(data.maxOrderQuantity ?? 10, 'maximum');
    this.isActive = data.isActive ?? true;
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
  }

  // Create new product variant instance with validation
  static create(data: {
    productId: string;
    name: string;
    denomination: number;
    mrp: number;
    costPrice: number;
    discountPercent: number;
    sellingPrice: number;
    stockQuantity?: number;
    minOrderQuantity?: number;
    maxOrderQuantity?: number;
  }): ProductVariant {
    return new ProductVariant({
      variantId: ulid(),
      ...data
    });
  }

  // Update variant data with validation
  update(data: Partial<{
    name: string;
    denomination: number;
    mrp: number;
    costPrice: number;
    discountPercent: number;
    sellingPrice: number;
    stockQuantity: number;
    minOrderQuantity: number;
    maxOrderQuantity: number;
    isActive: boolean;
  }>): ProductVariant {
    const updates: any = {};
    
    if (data.name !== undefined) {
      updates.name = this.validateName(data.name);
    }
    if (data.denomination !== undefined) {
      updates.denomination = this.validateDenomination(data.denomination);
    }
    if (data.mrp !== undefined) {
      updates.mrp = this.validatePrice(data.mrp, 'MRP');
    }
    if (data.costPrice !== undefined) {
      updates.costPrice = this.validatePrice(data.costPrice, 'cost price');
    }
    if (data.discountPercent !== undefined) {
      updates.discountPercent = this.validateDiscountPercent(data.discountPercent);
    }
    if (data.sellingPrice !== undefined) {
      updates.sellingPrice = this.validatePrice(data.sellingPrice, 'selling price');
    }
    if (data.stockQuantity !== undefined) {
      updates.stockQuantity = this.validateStock(data.stockQuantity);
    }
    if (data.minOrderQuantity !== undefined) {
      updates.minOrderQuantity = this.validateOrderQuantity(data.minOrderQuantity, 'minimum');
    }
    if (data.maxOrderQuantity !== undefined) {
      updates.maxOrderQuantity = this.validateOrderQuantity(data.maxOrderQuantity, 'maximum');
    }
    if (data.isActive !== undefined) {
      updates.isActive = data.isActive;
    }

    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Stock operations
  addStock(quantity: number): ProductVariant {
    if (quantity <= 0) {
      throw new Error('Stock quantity to add must be positive');
    }
    return this.update({ stockQuantity: this.stockQuantity + quantity });
  }

  reduceStock(quantity: number): ProductVariant {
    if (quantity <= 0) {
      throw new Error('Stock quantity to reduce must be positive');
    }
    if (this.stockQuantity < quantity) {
      throw new Error('Insufficient stock available');
    }
    return this.update({ stockQuantity: this.stockQuantity - quantity });
  }

  // Status operations
  activate(): ProductVariant {
    return this.update({ isActive: true });
  }

  deactivate(): ProductVariant {
    return this.update({ isActive: false });
  }

  // Computed properties
  get isInStock(): boolean {
    return this.stockQuantity > 0;
  }

  get isOutOfStock(): boolean {
    return this.stockQuantity === 0;
  }

  get hasLowStock(): boolean {
    return this.stockQuantity > 0 && this.stockQuantity <= this.minOrderQuantity;
  }

  get profitMargin(): number {
    return this.sellingPrice - this.costPrice;
  }

  get profitPercentage(): number {
    if (this.costPrice === 0) return 0;
    return ((this.sellingPrice - this.costPrice) / this.costPrice) * 100;
  }

  // Check if quantity is valid for ordering
  isValidOrderQuantity(quantity: number): boolean {
    return quantity >= this.minOrderQuantity && quantity <= this.maxOrderQuantity && quantity <= this.stockQuantity;
  }

  // Get formatted prices for display
  get formattedMRP(): string {
    const mrpInRupees = this.mrp / 100;
    return `₹${mrpInRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  get formattedSellingPrice(): string {
    const priceInRupees = this.sellingPrice / 100;
    return `₹${priceInRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  get formattedCostPrice(): string {
    const priceInRupees = this.costPrice / 100;
    return `₹${priceInRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  // Private validation methods
  private validateRequiredFields(data: any): void {
    const required = ['productId', 'variantId', 'name', 'denomination', 'mrp', 'costPrice', 'discountPercent', 'sellingPrice'];
    for (const field of required) {
      if (data[field] === undefined || data[field] === null) {
        throw new Error(`${field} is required`);
      }
    }
  }

  private validateName(name: string): string {
    if (!name || name.trim().length === 0) {
      throw new Error('Variant name cannot be empty');
    }
    if (name.length > 100) {
      throw new Error('Variant name cannot exceed 100 characters');
    }
    return name.trim();
  }

  private validateDenomination(denomination: number): number {
    if (denomination <= 0) {
      throw new Error('Denomination must be positive');
    }
    if (!Number.isInteger(denomination)) {
      throw new Error('Denomination must be a whole number');
    }
    return denomination;
  }

  private validatePrice(price: number, priceType: string): number {
    if (price <= 0) {
      throw new Error(`${priceType} must be positive`);
    }
    if (!Number.isInteger(price)) {
      throw new Error(`${priceType} must be an integer (in paise)`);
    }
    return price;
  }

  private validateDiscountPercent(discount: number): number {
    if (discount < 0 || discount > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }
    return discount;
  }

  private validateStock(stock: number): number {
    if (stock < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    if (!Number.isInteger(stock)) {
      throw new Error('Stock quantity must be an integer');
    }
    return stock;
  }

  private validateOrderQuantity(quantity: number, type: string): number {
    if (quantity <= 0) {
      throw new Error(`${type} order quantity must be positive`);
    }
    if (!Number.isInteger(quantity)) {
      throw new Error(`${type} order quantity must be an integer`);
    }
    return quantity;
  }
}

// Table configuration
export const PRODUCT_VARIANT_TABLE = process.env.PRODUCT_VARIANTS_TABLE || 'giftify-product-variants';
export const VARIANT_ID_GSI = 'VariantIdIndex'; 