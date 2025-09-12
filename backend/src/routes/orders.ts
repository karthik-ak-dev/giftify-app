import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createOrderHandler } from '../handlers/orders/createOrderHandler';
import { getOrdersHandler } from '../handlers/orders/getOrdersHandler';
import { getOrderByIdHandler } from '../handlers/orders/getOrderByIdHandler';
import { cancelOrderHandler } from '../handlers/orders/cancelOrderHandler';

const router = Router();

// POST /orders/create
router.post('/create', authenticateToken, createOrderHandler);

// GET /orders
router.get('/', authenticateToken, getOrdersHandler);

// GET /orders/:orderId
router.get('/:orderId', authenticateToken, getOrderByIdHandler);

// POST /orders/:orderId/cancel
router.post('/:orderId/cancel', authenticateToken, cancelOrderHandler);

export default router; 