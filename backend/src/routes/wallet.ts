import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getBalanceHandler } from '../handlers/wallet/getBalanceHandler';
import { topupHandler } from '../handlers/wallet/topupHandler';
import { getTransactionsHandler } from '../handlers/wallet/getTransactionsHandler';
import { createValidationMiddleware, walletSchemas } from '../utils/validation';

const router = Router();

// GET /wallet/balance
router.get('/balance', authenticateToken, getBalanceHandler);

// POST /wallet/topup
router.post('/topup', authenticateToken, createValidationMiddleware(walletSchemas.topup, 'body'), topupHandler);

// GET /wallet/transactions
router.get('/transactions', authenticateToken, createValidationMiddleware(walletSchemas.getTransactions, 'query'), getTransactionsHandler);

export default router; 