import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getTransactionsHandler } from '../handlers/wallet/getTransactionsHandler';
import { createValidationMiddleware, walletSchemas } from '../utils/validation';

const router = Router();

// GET /wallet/transactions
router.get('/transactions', authenticateToken, createValidationMiddleware(walletSchemas.getTransactions, 'query'), getTransactionsHandler);

export default router; 