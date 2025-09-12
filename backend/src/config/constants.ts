// Application Constants
export const APP_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_ORDER_PAGE_SIZE: 10,
  
  // Password & Security
  BCRYPT_SALT_ROUNDS: 12,
  ENCRYPTION_ALGORITHM: 'aes-256-gcm',
  
  // JWT Token Types
  JWT_TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh'
  } as const,
  
  // Default JWT Expiry
  DEFAULT_JWT_ACCESS_EXPIRES_IN: '15m',
  DEFAULT_JWT_REFRESH_EXPIRES_IN: '7d',
  
  // User Status
  USER_STATUS: {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    DELETED: 'DELETED'
  } as const,
  
  // Order Status
  ORDER_STATUS: {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    FULFILLED: 'FULFILLED',
    PARTIALLY_FULFILLED: 'PARTIALLY_FULFILLED',
    CANCELLED: 'CANCELLED',
    FAILED: 'FAILED'
  } as const,
  
  // Transaction Types
  TRANSACTION_TYPES: {
    CREDIT: 'CREDIT',
    DEBIT: 'DEBIT',
    REFUND: 'REFUND'
  } as const,
  
  // Transaction Status
  TRANSACTION_STATUS: {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
  } as const,
  
  // Gift Card Status
  GIFT_CARD_STATUS: {
    ACTIVE: 'ACTIVE',
    REDEEMED: 'REDEEMED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED'
  } as const,
  
  // Product Status
  PRODUCT_STATUS: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    DISCONTINUED: 'DISCONTINUED'
  } as const,
  
  // Currency
  CURRENCY: {
    CODE: 'INR',
    SYMBOL: '₹'
  } as const,
  
  // DynamoDB Table Names
  TABLE_NAMES: {
    USERS: 'giftify-users',
    WALLET_TRANSACTIONS: 'giftify-wallet-transactions',
    PRODUCTS: 'giftify-products',
    PRODUCT_VARIANTS: 'giftify-product-variants',
    CART: 'giftify-cart',
    ORDERS: 'giftify-orders',
    GIFT_CARDS: 'giftify-gift-cards'
  } as const,
  
  // GSI Names
  GSI_NAMES: {
    WALLET_TRANSACTIONS_BY_ID: 'TransactionIdIndex',
    PRODUCT_VARIANTS_BY_ID: 'VariantIdIndex',
    ORDERS_BY_ID: 'OrderIdIndex',
    GIFT_CARDS_BY_ID: 'GiftCardIdIndex',
    GIFT_CARDS_BY_NUMBER: 'GiftCardNumberIndex'
  } as const,
  
  // Error Codes
  ERROR_CODES: {
    // Authentication
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    USER_EXISTS: 'USER_EXISTS',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
    MISSING_TOKEN: 'MISSING_TOKEN',
    INVALID_TOKEN: 'INVALID_TOKEN',
    INVALID_TOKEN_TYPE: 'INVALID_TOKEN_TYPE',
    INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
    
    // Validation
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_AMOUNT: 'INVALID_AMOUNT',
    INVALID_QUANTITY: 'INVALID_QUANTITY',
    
    // Business Logic
    INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
    INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
    EMPTY_CART: 'EMPTY_CART',
    CART_NOT_FOUND: 'CART_NOT_FOUND',
    VARIANT_NOT_FOUND: 'VARIANT_NOT_FOUND',
    VARIANT_INACTIVE: 'VARIANT_INACTIVE',
    ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
    CANNOT_CANCEL: 'CANNOT_CANCEL',
    ACCESS_DENIED: 'ACCESS_DENIED',
    
    // System
    TOPUP_FAILED: 'TOPUP_FAILED',
    INTERNAL_ERROR: 'INTERNAL_ERROR'
  } as const,
  
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  } as const,
  
  // Validation Rules
  VALIDATION_RULES: {
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    EMAIL_MAX_LENGTH: 255,
    NAME_MAX_LENGTH: 100,
    PHONE_LENGTH: 10,
    DESCRIPTION_MAX_LENGTH: 500
  } as const
};

// Type exports for better type safety
export type UserStatus = typeof APP_CONSTANTS.USER_STATUS[keyof typeof APP_CONSTANTS.USER_STATUS];
export type OrderStatus = typeof APP_CONSTANTS.ORDER_STATUS[keyof typeof APP_CONSTANTS.ORDER_STATUS];
export type TransactionType = typeof APP_CONSTANTS.TRANSACTION_TYPES[keyof typeof APP_CONSTANTS.TRANSACTION_TYPES];
export type TransactionStatus = typeof APP_CONSTANTS.TRANSACTION_STATUS[keyof typeof APP_CONSTANTS.TRANSACTION_STATUS];
export type GiftCardStatus = typeof APP_CONSTANTS.GIFT_CARD_STATUS[keyof typeof APP_CONSTANTS.GIFT_CARD_STATUS];
export type ProductStatus = typeof APP_CONSTANTS.PRODUCT_STATUS[keyof typeof APP_CONSTANTS.PRODUCT_STATUS];
export type ErrorCode = typeof APP_CONSTANTS.ERROR_CODES[keyof typeof APP_CONSTANTS.ERROR_CODES]; 