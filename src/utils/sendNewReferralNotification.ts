import { sendEmail } from "./sendEmail";
import { toSentenceCase } from "./textHelpers";

/**
 * Sends an email to notify an agent that a new user registered with their referral link.
 * @param agent Object with agent's email and full name
 * @param user New user details (name, email, phone, track)
 */
export const sendNewReferralNotification = async (
  agent: { email: string; fullName: string },
  user: {
    fullName: string;
    email: string;
    phoneNumber: string;
    track: string;
  }
) => {
  const html = `
    <h3>Hello ${toSentenceCase(agent.fullName)},</h3>
    <p>A new user just registered using your referral link:</p>
    <ul>
      <li><strong>Name:</strong> ${toSentenceCase(user.fullName)}</li>
      <li><strong>Email:</strong> ${user.email}</li>
      <li><strong>Phone:</strong> ${user.phoneNumber}</li>
      <li><strong>Track:</strong> ${user.track}</li>
    </ul>
    <p>Keep sharing your link to refer more people!</p>
    <p>– RAD5 Tech Team</p>
  `;

  await sendEmail(agent.email, "New User Registered via Your Link", html);
};
