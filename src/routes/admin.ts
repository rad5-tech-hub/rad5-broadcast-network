import express from "express";
import {
  getAllAgents,
  deactivateAgentStatus,
  getUsersByAgent,
  createAdmin,
  loginAdmin,
} from "../controllers/adminController";

const router = express.Router();
//@ts-ignore
router.post("/create", createAdmin);
//@ts-ignore
router.post("/login", loginAdmin);
//@ts-ignore
router.get("/agents", getAllAgents);
//@ts-ignore
router.patch("/agent/:id/status", deactivateAgentStatus);
//@ts-ignore
router.get("/agent/:sharableLink/users", getUsersByAgent);

export default router;
