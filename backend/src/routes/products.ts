import { Router } from 'express';
import { getProductsHandler } from '../handlers/products/getProductsHandler';
import { createValidationMiddleware, productSchemas } from '../utils/validation';

const router = Router();

// GET /products
router.get('/', createValidationMiddleware(productSchemas.getProducts, 'query'), getProductsHandler);

export default router; 