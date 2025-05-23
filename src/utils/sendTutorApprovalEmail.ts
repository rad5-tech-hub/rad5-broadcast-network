import { sendEmail } from "./sendEmail";

export const sendTutorApprovalEmail = async (
  email: string,
  fullName: string
) => {
  const html = `
    <p>Hi ${fullName},</p>
    <p>Congratulations! Your account has been approved by the admin.</p>
    <p>You can now log in and start using your dashboard.</p>
    <p>Regards,<br/>OGEM Team</p>
  `;

  await sendEmail(email, "Your Tutor Account Has Been Approved", html);
};
