// routes/withdrawalRoutes.ts
import express from "express";
import {
  requestWithdrawal,
  approveOrRejectWithdrawal,
} from "../controllers/withdrawalController";

const router = express.Router();
//@ts-ignore
router.post("/request", requestWithdrawal);
//@ts-ignore
router.put("/approve/:id", approveOrRejectWithdrawal); // body: { action: "approve" or "reject" }

export default router;
