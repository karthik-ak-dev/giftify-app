import { Router } from 'express';
import { getProductsHandler } from '../handlers/products/getProductsHandler';

const router = Router();

// GET /products
router.get('/', getProductsHandler);

export default router; 