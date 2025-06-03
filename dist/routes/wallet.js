"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/admin.ts or routes/wallet.ts
const express_1 = require("express");
const walletController_1 = require("../controllers/walletController");
const adminAuth_1 = require("../middlewares/adminAuth");
const router = (0, express_1.Router)();
// Admin marks a user as paid and credits the agent
//@ts-ignore
router.post("/mark-paid", adminAuth_1.isAdmin, walletController_1.markUserAsPaid);
// Get wallet + transactions for an agent
//@ts-ignore
router.get("/agent/:agentId", walletController_1.getAgentWalletAndTransactions);
//@ts-ignore
router.get("/all-transactions", walletController_1.allWalletTransaction);
exports.default = router;
