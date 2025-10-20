import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createOrderHandler } from '../handlers/orders/createOrderHandler';
import { getOrdersHandler } from '../handlers/orders/getOrdersHandler';
import { getOrderByIdHandler } from '../handlers/orders/getOrderByIdHandler';
import { createValidationMiddleware, orderSchemas } from '../utils/validation';

const router = Router();

// POST /orders/create
router.post('/create', authenticateToken, createOrderHandler);

// GET /orders
router.get('/', authenticateToken, createValidationMiddleware(orderSchemas.getOrders, 'query'), getOrdersHandler);

// GET /orders/:orderId
router.get('/:orderId', authenticateToken, createValidationMiddleware(orderSchemas.orderParams, 'params'), getOrderByIdHandler);

export default router; 