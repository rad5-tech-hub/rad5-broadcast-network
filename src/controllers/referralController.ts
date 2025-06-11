import { Request, Response } from 'express';

export const handleReferralRedirect = (req: Request, res: Response) => {
  const { referralCode } = req.params;
  const frontendUrl = `https://rad-5-broker-network.vercel.app/signup?ref=${referralCode}`;
  return res.redirect(frontendUrl);
};
