import { JWTPayload } from '../types/auth';
import { ENV_CONFIG } from '../config/env';
import { APP_CONSTANTS } from '../config/constants';
import crypto from 'crypto';

// Simple JWT implementation to avoid dependency issues
// In production, replace with proper jsonwebtoken library

interface SimpleJWTPayload extends JWTPayload {
  exp?: number;
  iat?: number;
}

const base64UrlEncode = (str: string): string => {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const base64UrlDecode = (str: string): string => {
  str += new Array(5 - str.length % 4).join('=');
  return Buffer.from(str.replace(/\-/g, '+').replace(/_/g, '/'), 'base64').toString();
};

const createSignature = (data: string, secret: string): string => {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
};

export const generateAccessToken = (userId: string, email: string): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: SimpleJWTPayload = {
    userId,
    email,
    type: APP_CONSTANTS.JWT_TOKEN_TYPES.ACCESS,
    iat: now,
    exp: now + (15 * 60) // 15 minutes
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = createSignature(data, ENV_CONFIG.JWT_ACCESS_SECRET);

  return `${data}.${signature}`;
};

export const generateRefreshToken = (userId: string, email: string): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: SimpleJWTPayload = {
    userId,
    email,
    type: APP_CONSTANTS.JWT_TOKEN_TYPES.REFRESH,
    iat: now,
    exp: now + (7 * 24 * 60 * 60) // 7 days
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = createSignature(data, ENV_CONFIG.JWT_REFRESH_SECRET);

  return `${data}.${signature}`;
};

export const verifyToken = (token: string, secret: string): JWTPayload => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;
    
    // Verify signature
    const expectedSignature = createSignature(data, secret);
    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SimpleJWTPayload;
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    return payload;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Token verification failed');
  }
};

// Helper functions for common token operations
export const verifyAccessToken = (token: string): JWTPayload => {
  const decoded = verifyToken(token, ENV_CONFIG.JWT_ACCESS_SECRET);
  
  if (decoded.type !== APP_CONSTANTS.JWT_TOKEN_TYPES.ACCESS) {
    throw new Error('Invalid token type');
  }
  
  return decoded;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  const decoded = verifyToken(token, ENV_CONFIG.JWT_REFRESH_SECRET);
  
  if (decoded.type !== APP_CONSTANTS.JWT_TOKEN_TYPES.REFRESH) {
    throw new Error('Invalid token type');
  }
  
  return decoded;
};

// Token utility functions
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

export const getTokenExpirationTime = (token: string): Date | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(base64UrlDecode(parts[1])) as SimpleJWTPayload;
    if (payload.exp) {
      return new Date(payload.exp * 1000);
    }
    return null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) {
    return true;
  }
  
  return expirationTime < new Date();
}; 