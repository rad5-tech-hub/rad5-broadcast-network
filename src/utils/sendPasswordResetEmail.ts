import { sendEmail } from './sendEmail';

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${token}`;

  const html = `<p>Click the link to reset your password (expires in 10 minutes):</p>
                <a href="${resetUrl}">${resetUrl}</a>`;

  await sendEmail(email, "Reset Your Password", html);
};
