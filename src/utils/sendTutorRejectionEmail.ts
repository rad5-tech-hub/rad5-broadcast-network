import { sendEmail } from "./sendEmail";

export const sendTutorRejectionEmail = async (
  email: string,
  fullName: string,
  feedback: string | null
) => {
  const html = `
    <p>Hi ${fullName},</p>
    <p>We regret to inform you that your tutor application has been rejected.</p>
    ${feedback ? `<p><strong>Reason:</strong> ${feedback}</p>` : ""}
    <p>If you believe this was a mistake or need clarification, feel free to contact us.</p>
    <p>Regards,<br/>OGEM Team</p>
  `;

  await sendEmail(email, "Your Tutor Application Has Been Rejected", html);
};
