import express from "express";
import {
  getAllAgents,
  toggleAgentStatus,
  getUsersByAgent,
  createAdmin,
  loginAdmin,
  getAdminDashboard,
  deleteAgentByAdmin,
  getAuditTrail,
} from '../controllers/adminController';
import { isAdmin } from "../middlewares/adminAuth";

const router = express.Router();
//@ts-ignore
router.post("/create", isAdmin, createAdmin);
//@ts-ignore
router.post("/login", loginAdmin);
//@ts-ignore
router.get("/agents", isAdmin, getAllAgents);
//@ts-ignore
router.patch('/agent/:id/status', isAdmin, toggleAgentStatus);
//@ts-ignore
router.get("/agent/:sharableLink/users", isAdmin, getUsersByAgent);
//@ts-ignore
router.get('/dashboard', isAdmin, getAdminDashboard);
//@ts-ignore
router.get('/audit-trail', isAdmin, getAuditTrail); //recent activities
//@ts-ignore
router.delete('/agents/:id', isAdmin, deleteAgentByAdmin);

export default router;
