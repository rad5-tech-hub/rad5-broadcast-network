import { Request, Response } from 'express';

import Agent from '../models/agent';

export const handleReferralRedirect = async (req: Request, res: Response) => {
  const { referralCode } = req.params;

  try {
    const agent = await Agent.findOne({ where: { referralCode } });

    if (!agent) {
      return res.status(404).json({ message: 'Invalid referral link' });
    }

    // Redirect to signup with ref query
    const frontendUrl = `https://rad-5-broker-network.vercel.app/register?ref=${referralCode}`;
    return res.redirect(frontendUrl);
  } catch (error) {
    console.error('Referral redirect error:', error);
    return res.status(500).json({  message:
        'Oops! Something went wrong while processing your referral. Please try again later or contact support.',
    });;
  }
};
