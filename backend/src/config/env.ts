import { APP_CONSTANTS } from './constants';

// Environment Configuration
export const ENV_CONFIG = {
  // Node Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // AWS Configuration
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  
  // JWT Configuration
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_ACCESS_SECRET is required in production');
    }
    return 'dev-access-secret';
  })(),
  
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_REFRESH_SECRET is required in production');
    }
    return 'dev-refresh-secret';
  })(),
  
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || APP_CONSTANTS.DEFAULT_JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || APP_CONSTANTS.DEFAULT_JWT_REFRESH_EXPIRES_IN,
  
  // Encryption Configuration
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY is required in production');
    }
    return 'dev-encryption-key-32-chars-long!!';
  })(),
  
  // DynamoDB Configuration
  DYNAMODB_ENDPOINT: process.env.NODE_ENV === 'development' 
    ? process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'
    : undefined,
    
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || (
    process.env.NODE_ENV === 'production' 
      ? 'https://your-frontend-domain.com'
      : '*'
  ),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || (
    process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  ),
  
  // Server Configuration
  PORT: parseInt(process.env.PORT || '3000'),
  
  // Feature Flags
  FEATURES: {
    ENABLE_REQUEST_LOGGING: process.env.ENABLE_REQUEST_LOGGING === 'true' || process.env.NODE_ENV === 'development',
    ENABLE_DETAILED_ERRORS: process.env.ENABLE_DETAILED_ERRORS === 'true' || process.env.NODE_ENV === 'development'
  }
};

// Validation function to ensure all required environment variables are set
export const validateEnvironment = (): void => {
  const requiredVars = [
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'ENCRYPTION_KEY'
  ];
  
  if (ENV_CONFIG.NODE_ENV === 'production') {
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
};

// Helper functions
export const isDevelopment = (): boolean => ENV_CONFIG.NODE_ENV === 'development';
export const isProduction = (): boolean => ENV_CONFIG.NODE_ENV === 'production';
export const isTest = (): boolean => ENV_CONFIG.NODE_ENV === 'test'; 