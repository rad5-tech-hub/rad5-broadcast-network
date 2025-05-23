// utils/sendAgentNotification.ts
import { sendEmail } from "./sendEmail";

/**
 * Notifies an agent about the status of their withdrawal request.
 * @param agent Object with agent's email and first name
 * @param amount Withdrawal amount
 * @param status "approved" or "rejected"
 */
export const sendAgentNotification = async (
  agent: { email: string; firstName?: string },
  amount: number,
  status: "approved" | "rejected"
) => {
  const html = `
    <p>Hi ${agent.firstName || "Agent"},</p>
    <p>Your withdrawal request of <strong>₦${amount.toLocaleString()}</strong> has been <strong>${status}</strong> by the admin.</p>
    ${
      status === "approved"
        ? "<p>Expect payment shortly.</p>"
        : "<p>Please contact support for clarification.</p>"
    }
    <p>Thank you,<br/>RBN Team</p>
  `;

  await sendEmail(agent.email, `Withdrawal ${status.toUpperCase()}`, html);
};
