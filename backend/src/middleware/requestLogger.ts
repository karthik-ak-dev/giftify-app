import { Request, Response, NextFunction } from 'express';
import { ENV_CONFIG } from '../config/env';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Log request
  if (ENV_CONFIG.LOG_LEVEL === 'debug') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, {
      headers: req.headers,
      body: req.method !== 'GET' ? req.body : undefined,
      query: req.query,
      ip: req.ip
    });
  } else {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body: any) {
    const duration = Date.now() - startTime;
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    
    if (ENV_CONFIG.LOG_LEVEL === 'debug' && res.statusCode >= 400) {
      console.log('Response body:', body);
    }
    
    return originalJson.call(this, body);
  };

  next();
}; 