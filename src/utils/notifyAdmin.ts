import { sendEmail } from "./sendEmail";

/**
 * Notifies the admin that a new tutor has registered.
 * @param adminEmail Admin email address
 * @param tutorName Full name of the tutor
 * @param tutorEmail Tutor's email address
 * @param tutorId ID of the tutor
 */
export const sendTutorAdminNotification = async (
  adminEmail: string,
  tutorName: string,
  tutorEmail: string,
  tutorId: string
) => {
  const dashboardUrl = `${process.env.ADMIN_DASHBOARD_URL}/tutors/${tutorId}`;

  const html = `
    <p>Hello Admin,</p>
    <p>A new tutor has registered and requires your approval:</p>
    <ul>
      <li><strong>Name:</strong> ${tutorName}</li>
      <li><strong>Email:</strong> ${tutorEmail}</li>
    </ul>
    <p>You can approve or reject this tutor by visiting the link below:</p>
    <a href="${dashboardUrl}">${dashboardUrl}</a>
  `;

  await sendEmail(adminEmail, "New Tutor Approval Request", html);
};
