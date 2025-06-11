import express from 'express';
import { handleReferralRedirect } from '../controllers/referralController';

const router = express.Router();

router.get('/:referralCode', handleReferralRedirect); // Catch-all referral route

export default router;
