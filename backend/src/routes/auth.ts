import { Router } from 'express';
import { registerHandler } from '../handlers/auth/registerHandler';
import { loginHandler } from '../handlers/auth/loginHandler';
import { refreshHandler } from '../handlers/auth/refreshHandler';
import { createValidationMiddleware, authSchemas } from '../utils/validation';

const router = Router();

// POST /auth/register
router.post('/register', createValidationMiddleware(authSchemas.register, 'body'), registerHandler);

// POST /auth/login
router.post('/login', createValidationMiddleware(authSchemas.login, 'body'), loginHandler);

// POST /auth/refresh
router.post('/refresh', createValidationMiddleware(authSchemas.refresh, 'body'), refreshHandler);

export default router; 