import { sendEmail } from './sendEmail';
import Agent from '../models/agent';
import Admin from '../models/admin';

/**
 * Sends an email to the admin when a withdrawal request is made.
 * @param agentId ID of the agent making the withdrawal
 * @param amount Requested withdrawal amount
 * @param description Optional description
 */
export const sendWithdrawalEmailToAdmin = async (
  agentId: string,
  amount: number,
  description?: string,
) => {
  const agent = await Agent.findByPk(agentId);
  if (!agent) return;

  const admin = await Admin.findOne({ where: { role: 'admin' } });
  if (!admin || !admin.email) return;

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 50px; text-align: center;">
        <div style="background: white; display: inline-block; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #007bff;">💰 New Withdrawal Request</h2>
          <p style="font-size: 16px; color: #333;"><strong>${
            agent.fullName || 'An agent'
          }</strong> has requested a withdrawal.</p>
          <ul style="list-style: none; padding: 0; text-align: left;">
            <li><strong> Agent Name:</strong> ${agent.fullName || 'N/A'}</li>
            <li><strong> Email:</strong> ${agent.email}</li>
            <li><strong> Amount:</strong> ₦${amount.toLocaleString()}</li>
            <li><strong> Description:</strong> ${description || 'N/A'}</li>
          </ul>
          <p style="margin-top: 20px;">Please review and process this request on the admin dashboard.</p>
          <button 
            onclick="window.location.href='${
              process.env.FRONTEND_BASE_URL
            }/signin';"
            style="
              margin-top: 20px;
              padding: 12px 24px;
              background-color: #007bff;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
            "
          >
            Go to Admin Dashboard
          </button>
        </div>
      </body>
    </html>
  `;

  await sendEmail(admin.email, 'New Withdrawal Request from Agent', html);
};
