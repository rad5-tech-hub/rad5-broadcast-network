// routes/admin.ts or routes/wallet.ts
import { Router } from "express";
import {
  markUserAsPaid,
  getAgentWalletAndTransactions,
  allWalletTransaction,
} from "../controllers/walletController";
import { isAdmin } from "../middlewares/adminAuth";

const router = Router();

// Admin marks a user as paid and credits the agent
//@ts-ignore
router.post("/mark-paid", isAdmin, markUserAsPaid);
// Get wallet + transactions for an agent
//@ts-ignore
router.get("/agent/:agentId", getAgentWalletAndTransactions);
//@ts-ignore
router.get("/all-transactions", allWalletTransaction);

export default router;
