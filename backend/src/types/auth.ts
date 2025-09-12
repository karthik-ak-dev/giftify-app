import { Request } from 'express';

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

// Authenticated Request
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
} 