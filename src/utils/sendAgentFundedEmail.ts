// utils/sendAgentFundedEmail.ts
import { sendEmail } from './sendEmail';

export const sendAgentFundedEmail = async (
  agent: { email: string; firstName?: string },
  amount: number,
  userFullName: string,
) => {
  const html = `
    <p>Hi ${agent.firstName || 'Agent'},</p>
    <p>You have just been funded with a commission of <strong>₦${amount.toLocaleString()}</strong> from the payment made by <strong>${userFullName}</strong>.</p>
    <p>This amount has been added to your wallet balance.</p>
    <p>Thank you,<br/>RBN Team</p>
  `;

  await sendEmail(agent.email, "You've been credited with a commission", html);
};
