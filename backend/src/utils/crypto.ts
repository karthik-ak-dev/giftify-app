import crypto from 'crypto';
import { ENV_CONFIG } from '../config/env';
import { APP_CONSTANTS } from '../config/constants';

// Note: Using Node.js built-in crypto for password hashing as a fallback
// In production, consider using bcrypt when dependencies are properly installed
export const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    resolve(`${salt}:${hash}`);
  });
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const [salt, hash] = hashedPassword.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    resolve(hash === verifyHash);
  });
};

export const encrypt = (text: string): string => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(APP_CONSTANTS.ENCRYPTION_ALGORITHM, ENV_CONFIG.ENCRYPTION_KEY);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Note: Using deprecated createCipher for simplicity. In production, use createCipherGCM with proper IV handling
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    throw new Error('Encryption failed');
  }
};

export const decrypt = (encryptedText: string): string => {
  try {
    const parts = encryptedText.split(':');
    
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipher(APP_CONSTANTS.ENCRYPTION_ALGORITHM, ENV_CONFIG.ENCRYPTION_KEY);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed');
  }
};

// Additional crypto utilities
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateGiftCardNumber = (): string => {
  // Generate a 16-digit gift card number
  const randomBytes = crypto.randomBytes(8);
  const number = randomBytes.readBigUInt64BE(0).toString();
  return number.padStart(16, '0').substring(0, 16);
};

export const generateGiftCardPin = (): string => {
  // Generate a 6-digit PIN
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashSensitiveData = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

export const createHmac = (data: string, secret: string = ENV_CONFIG.ENCRYPTION_KEY): string => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
};

export const verifyHmac = (data: string, signature: string, secret: string = ENV_CONFIG.ENCRYPTION_KEY): boolean => {
  const expectedSignature = createHmac(data, secret);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}; 