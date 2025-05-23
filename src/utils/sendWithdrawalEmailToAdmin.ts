import { sendEmail } from "./sendEmail";
import Agent from "../models/agent";
import Admin from "../models/admin";

/**
 * Sends an email to the admin when a withdrawal request is made.
 * @param agentId ID of the agent making the withdrawal
 * @param amount Requested withdrawal amount
 * @param description Optional description
 */
export const sendWithdrawalEmailToAdmin = async (
  agentId: string,
  amount: number,
  description?: string
) => {
  const agent = await Agent.findByPk(agentId);
  if (!agent) return;

  const admin = await Admin.findOne({ where: { role: "admin" } });
  if (!admin || !admin.email) return;

  const html = `
    <p>Hello Admin,</p>
    <p><strong>${
      agent.fullName || "An agent"
    }</strong> has requested a withdrawal:</p>
    <ul>
      <li><strong>Agent Name:</strong> ${agent.fullName || ""} 
  </li>
      <li><strong>Email:</strong> ${agent.email}</li>
      <li><strong>Amount:</strong> ₦${amount.toLocaleString()}</li>
      <li><strong>Description:</strong> ${description || "N/A"}</li>
    </ul>
    <p>Please review and process this request on the admin dashboard.</p>
  `;

  await sendEmail(admin.email, "New Withdrawal Request from Agent", html);
};
