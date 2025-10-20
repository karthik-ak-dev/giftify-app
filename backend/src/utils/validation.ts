import Joi from 'joi';
import { APP_CONSTANTS } from '../config/constants';
import { TransactionType } from '../models/WalletTransactionModel';
import { OrderStatus } from '../models/OrderModel';

/**
 * Validation Schemas using Joi
 * 
 * Purpose: This file provides centralized validation schemas for all API endpoints.
 * It ensures data integrity, security, and consistent validation across the application.
 * 
 * Features:
 * - Input sanitization and validation
 * - Type coercion and transformation
 * - Custom error messages
 * - Reusable validation patterns
 * - Security validations (email, password strength, etc.)
 */

// Common validation patterns
const commonPatterns = {
  email: Joi.string()
    .email()
    .max(APP_CONSTANTS.VALIDATION_RULES.EMAIL_MAX_LENGTH)
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.max': `Email must not exceed ${APP_CONSTANTS.VALIDATION_RULES.EMAIL_MAX_LENGTH} characters`,
      'any.required': 'Email is required'
    }),
    
  password: Joi.string()
    .min(APP_CONSTANTS.VALIDATION_RULES.PASSWORD_MIN_LENGTH)
    .max(APP_CONSTANTS.VALIDATION_RULES.PASSWORD_MAX_LENGTH)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': `Password must be at least ${APP_CONSTANTS.VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`,
      'string.max': `Password must not exceed ${APP_CONSTANTS.VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters`,
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
    
  name: Joi.string()
    .max(APP_CONSTANTS.VALIDATION_RULES.NAME_MAX_LENGTH)
    .trim()
    .required()
    .messages({
      'string.max': `Name must not exceed ${APP_CONSTANTS.VALIDATION_RULES.NAME_MAX_LENGTH} characters`,
      'any.required': 'Name is required'
    }),
    
  phoneNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid 10-digit Indian mobile number'
    }),
    
  ulid: Joi.string()
    .length(26)
    .pattern(/^[0-9A-HJKMNP-TV-Z]{26}$/)
    .required()
    .messages({
      'string.length': 'Invalid ID format',
      'string.pattern.base': 'Invalid ID format'
    }),
    
  positiveInteger: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.positive': 'Value must be a positive number',
      'number.integer': 'Value must be an integer'
    }),
    
  amount: Joi.number()
    .positive()
    .max(10000000) // 1 crore in paise
    .required()
    .messages({
      'number.positive': 'Amount must be greater than 0',
      'number.max': 'Amount cannot exceed ₹1,00,00,000'
    }),
    
  pagination: {
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.min': 'Page must be at least 1'
      }),
      
    limit: Joi.number()
      .integer()
      .min(1)
      .max(APP_CONSTANTS.MAX_PAGE_SIZE)
      .default(APP_CONSTANTS.DEFAULT_PAGE_SIZE)
      .messages({
        'number.min': 'Limit must be at least 1',
        'number.max': `Limit cannot exceed ${APP_CONSTANTS.MAX_PAGE_SIZE}`
      })
  }
};

// Authentication Schemas
export const authSchemas = {
  register: Joi.object({
    email: commonPatterns.email,
    password: commonPatterns.password,
    firstName: commonPatterns.name,
    lastName: commonPatterns.name,
    phoneNumber: commonPatterns.phoneNumber
  }),
  
  login: Joi.object({
    email: commonPatterns.email,
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),
  
  refresh: Joi.object({
    refreshToken: Joi.string().required().messages({
      'any.required': 'Refresh token is required'
    })
  })
};

// User Schemas
export const userSchemas = {
  updateProfile: Joi.object({
    firstName: Joi.string()
      .max(APP_CONSTANTS.VALIDATION_RULES.NAME_MAX_LENGTH)
      .trim()
      .optional(),
    lastName: Joi.string()
      .max(APP_CONSTANTS.VALIDATION_RULES.NAME_MAX_LENGTH)
      .trim()
      .optional(),
    phoneNumber: commonPatterns.phoneNumber
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  })
};

// Wallet Schemas
export const walletSchemas = {
  getTransactions: Joi.object({
    page: commonPatterns.pagination.page,
    limit: commonPatterns.pagination.limit,
    type: Joi.string()
      .valid(...Object.values(TransactionType))
      .optional()
      .messages({
        'any.only': `Transaction type must be one of: ${Object.values(TransactionType).join(', ')}`
      })
  })
};

// Cart Schemas
export const cartSchemas = {
  manageCart: Joi.object({
    variantId: commonPatterns.ulid,
    quantity: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .required()
      .messages({
        'number.min': 'Quantity cannot be negative',
        'number.max': 'Quantity cannot exceed 100 per item',
        'any.required': 'Quantity is required'
      })
  })
};

// Order Schemas
export const orderSchemas = {
  getOrders: Joi.object({
    page: commonPatterns.pagination.page,
    limit: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .default(APP_CONSTANTS.DEFAULT_ORDER_PAGE_SIZE),
    status: Joi.string()
      .valid(...Object.values(OrderStatus))
      .optional()
      .messages({
        'any.only': `Order status must be one of: ${Object.values(OrderStatus).join(', ')}`
      })
  }),
  
  orderParams: Joi.object({
    orderId: commonPatterns.ulid
  })
};

// Product Schemas
export const productSchemas = {
  getProducts: Joi.object({
    category: Joi.string()
      .max(50)
      .trim()
      .optional(),
    search: Joi.string()
      .max(100)
      .trim()
      .optional()
  })
};

// Validation helper functions
export const validateRequest = async (schema: Joi.ObjectSchema, data: any): Promise<any> => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join('; ');
      throw new Error(errorMessage);
    }
    
    return value;
  } catch (validationError) {
    throw validationError;
  }
};

// Middleware factory for route validation
export const createValidationMiddleware = (schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return async (req: any, res: any, next: any) => {
    try {
      const dataToValidate = req[source];
      req[source] = await validateRequest(schema, dataToValidate);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error instanceof Error ? error.message : 'Invalid request data',
        timestamp: new Date().toISOString()
      });
    }
  };
}; 