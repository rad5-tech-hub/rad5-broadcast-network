// routes/userRoutes.ts
import express from 'express';
import {
  registerUserUnderAgent,
  getUsersUnderAgent,
} from '../controllers/userController';

const router = express.Router();
//@ts-ignore
router.post('/register/:linkCode', registerUserUnderAgent);
//@ts-ignore
router.get('/agent/:agentId', getUsersUnderAgent);

export default router;
