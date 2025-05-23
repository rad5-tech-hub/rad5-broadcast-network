import express from "express";
import {
  register,
  forgotPassword,
  resetPassword,
  verifyAgentEmail,
  login,
} from "../controllers/agentController";
import { upload } from "../config/multer";

const router = express.Router();

router.post("/register", upload.single("profileImage"), register);
//@ts-ignore
router.get("/verify-email-agent", verifyAgentEmail);
//@ts-ignore
router.post("/login", login);

//@ts-ignore
router.post("/forgot-password", forgotPassword);
//@ts-ignore
router.post("/reset-password/:token", resetPassword);

export default router;
