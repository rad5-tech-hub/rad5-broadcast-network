import express from 'express';
import {
  register,
  forgotPassword,
  resetPassword,
  verifyAgentEmail,
  login,
  getAgentDashboard,
  updateAgentProfilePicture,
  getAllAgentsAndUsers,
  resendVerificationEmailAgent,
} from '../controllers/agentController';
import { upload } from '../config/multer';
import { isAgent } from '../middlewares/isAgent';

const router = express.Router();

router.post('/register', upload.single('profileImage'), register);
//@ts-ignore
router.get('/verify-email-agent', verifyAgentEmail);
//@ts-ignore
router.post('/login', login);

//@ts-ignore
router.post('/forgot-password', forgotPassword);
//@ts-ignore
router.post('/reset-password/:token', resetPassword);

//@ts-ignore
router.get('/dashboard', isAgent, getAgentDashboard);

//@ts-ignore
router.patch(
  '/profile-picture',
  isAgent,
  upload.single('profileImage'),
  updateAgentProfilePicture,
);

//@ts-ignore
router.get('/all-agents-users', getAllAgentsAndUsers);
//@ts-ignore
router.post('/resend-verification', resendVerificationEmailAgent);


export default router;
