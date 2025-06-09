// routes/withdrawalRoutes.ts
import express from 'express';
import {
  requestWithdrawal,
  approveOrRejectWithdrawal,
} from '../controllers/withdrawalController';
import { isAgent } from '../middlewares/isAgent';
import { isAdmin } from '../middlewares/adminAuth';

const router = express.Router();
//@ts-ignore
router.post('/request', isAgent, requestWithdrawal);
//@ts-ignore
router.put('/approve/:id', isAdmin, approveOrRejectWithdrawal); // body: { action: "approve" or "reject" }

export default router;
