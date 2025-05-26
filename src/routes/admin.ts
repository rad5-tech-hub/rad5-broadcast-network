import express from "express";
import {
  getAllAgents,
  deactivateAgentStatus,
  getUsersByAgent,
  createAdmin,
  loginAdmin,
} from "../controllers/adminController";
import { isAdmin } from "../middlewares/adminAuth";

const router = express.Router();
//@ts-ignore
router.post("/create", createAdmin);
//@ts-ignore
router.post("/login", loginAdmin);
//@ts-ignore
router.get("/agents", isAdmin, getAllAgents);
//@ts-ignore
router.patch("/agent/:id/status", isAdmin, deactivateAgentStatus);
//@ts-ignore
router.get("/agent/:sharableLink/users", isAdmin, getUsersByAgent);

export default router;
