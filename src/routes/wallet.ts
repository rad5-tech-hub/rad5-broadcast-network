// routes/admin.ts or routes/wallet.ts
import { Router } from "express";
import {
  markUserAsPaid,
  getAgentWalletAndTransactions,
} from "../controllers/walletController";

const router = Router();

// Admin marks a user as paid and credits the agent
//@ts-ignore
router.post("/mark-paid", markUserAsPaid);
// Get wallet + transactions for an agent
//@ts-ignore
router.get("/agent/:agentId", getAgentWalletAndTransactions);

export default router;
