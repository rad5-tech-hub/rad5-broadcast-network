import express from 'express';
import { handleReferralRedirect } from '../controllers/referralController';
import { referralLimiter } from '../middlewares/rateLimiter';

const router = express.Router();

//@ts-ignore
router.get('/:referralCode', referralLimiter, handleReferralRedirect); // Catch-all referral route

export default router;
