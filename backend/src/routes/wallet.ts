import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getBalanceHandler } from '../handlers/wallet/getBalanceHandler';
import { topupHandler } from '../handlers/wallet/topupHandler';
import { getTransactionsHandler } from '../handlers/wallet/getTransactionsHandler';

const router = Router();

// GET /wallet/balance
router.get('/balance', authenticateToken, getBalanceHandler);

// POST /wallet/topup
router.post('/topup', authenticateToken, topupHandler);

// GET /wallet/transactions
router.get('/transactions', authenticateToken, getTransactionsHandler);

export default router; 