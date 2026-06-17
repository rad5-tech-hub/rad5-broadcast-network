// routes/userRoutes.ts
import express from 'express';
import {
  registerUserUnderAgent,
  getUsersUnderAgent,
  getAllUsers
} from '../controllers/userController';
import { isAdmin } from "../middlewares/adminAuth";

const router = express.Router();
//@ts-ignore
router.post('/register/:linkCode', registerUserUnderAgent);
//@ts-ignore
router.get('/agent/:agentId', getUsersUnderAgent);

router.get('/all-users', isAdmin, getAllUsers);

export default router;
