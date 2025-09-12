import { Router } from 'express';
import { registerHandler } from '../handlers/auth/registerHandler';
import { loginHandler } from '../handlers/auth/loginHandler';
import { refreshHandler } from '../handlers/auth/refreshHandler';

const router = Router();

// POST /auth/register
router.post('/register', registerHandler);

// POST /auth/login
router.post('/login', loginHandler);

// POST /auth/refresh
router.post('/refresh', refreshHandler);

export default router; 