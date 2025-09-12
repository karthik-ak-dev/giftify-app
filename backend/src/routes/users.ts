import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getProfileHandler } from '../handlers/users/getProfileHandler';
import { updateProfileHandler } from '../handlers/users/updateProfileHandler';
import { createValidationMiddleware, userSchemas } from '../utils/validation';

const router = Router();

// GET /users/profile
router.get('/profile', authenticateToken, getProfileHandler);

// PUT /users/profile
router.put('/profile', authenticateToken, createValidationMiddleware(userSchemas.updateProfile, 'body'), updateProfileHandler);

export default router; 