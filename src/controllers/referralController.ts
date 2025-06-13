import { Request, Response } from 'express';
import Agent from '../models/agent';

export const handleReferralRedirect = async (req: Request, res: Response) => {
  const { referralCode } = req.params;

  try {
    console.log("Received referralCode:", referralCode);

    const agent = await Agent.findOne({ where: { sharableLink: referralCode } });

    if (!agent) {
      console.warn('No agent found for:', referralCode);
      return res.status(404).json({ message: 'Invalid referral link' });
    }

    const frontendUrl = `https://rad-5-broker-network.vercel.app/register?ref=${referralCode}`;
    return res.redirect(frontendUrl);
  } catch (error) {
    console.error('Referral redirect error:', error);
    return res.status(500).json({
      message: 'Oops! Something went wrong while processing your referral. Please try again later or contact support.',
    });
  }
};
