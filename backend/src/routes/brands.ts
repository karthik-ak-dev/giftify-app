import { Router } from 'express';
import { getBrandsHandler } from '../handlers/brands/getBrandsHandler';

const router = Router();

/**
 * @route   GET /api/brands
 * @desc    Get all brands with all variants
 * @note    Frontend handles all filtering, sorting, and searching
 * @access  Public
 */
router.get('/', getBrandsHandler);

export default router;

