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

 