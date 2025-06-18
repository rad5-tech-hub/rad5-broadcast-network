// routes/withdrawalRoutes.ts
import express from 'express';
import {
  requestWithdrawal,
  approveOrRejectWithdrawal,
  getAllWithdrawals,
  getAgentWithdrawals,
} from '../controllers/withdrawalController';
import { isAgent } from '../middlewares/isAgent';
import { isAdmin } from '../middlewares/adminAuth';

const router = express.Router();
//@ts-ignore
router.post('/request', isAgent, requestWithdrawal);
//@ts-ignore
router.put('/approve/:id', isAdmin, approveOrRejectWithdrawal); 
//@ts-ignore
router.get('/withdrawals',isAdmin, getAllWithdrawals);
//@ts-ignore
router.get('/withdrawals/:agentId', isAgent, getAgentWithdrawals);


export default router;
