import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getProfileHandler } from '../handlers/users/getProfileHandler';
import { updateProfileHandler } from '../handlers/users/updateProfileHandler';

const router = Router();

// GET /users/profile
router.get('/profile', authenticateToken, getProfileHandler);

// PUT /users/profile
router.put('/profile', authenticateToken, updateProfileHandler);

export default router; 