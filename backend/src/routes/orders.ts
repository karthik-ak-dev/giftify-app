import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createOrderHandler } from '../handlers/orders/createOrderHandler';
import { getOrdersHandler } from '../handlers/orders/getOrdersHandler';
import { getOrderByIdHandler } from '../handlers/orders/getOrderByIdHandler';
import { cancelOrderHandler } from '../handlers/orders/cancelOrderHandler';
import { createValidationMiddleware, orderSchemas } from '../utils/validation';

const router = Router();

// POST /orders/create
router.post('/create', authenticateToken, createOrderHandler);

// GET /orders
router.get('/', authenticateToken, createValidationMiddleware(orderSchemas.getOrders, 'query'), getOrdersHandler);

// GET /orders/:orderId
router.get('/:orderId', authenticateToken, createValidationMiddleware(orderSchemas.orderParams, 'params'), getOrderByIdHandler);

// POST /orders/:orderId/cancel
router.post('/:orderId/cancel', authenticateToken, createValidationMiddleware(orderSchemas.orderParams, 'params'), cancelOrderHandler);

export default router; 