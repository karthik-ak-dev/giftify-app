import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getCartHandler } from '../handlers/cart/getCartHandler';
import { manageCartHandler } from '../handlers/cart/manageCartHandler';
import { clearCartHandler } from '../handlers/cart/clearCartHandler';

const router = Router();

// GET /cart
router.get('/', authenticateToken, getCartHandler);

// PUT /cart/manage
router.put('/manage', authenticateToken, manageCartHandler);

// DELETE /cart/clear
router.delete('/clear', authenticateToken, clearCartHandler);

export default router; 