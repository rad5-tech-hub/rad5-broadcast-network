
import { sendEmail } from "./sendEmail";

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const url = `${process.env.BASE_URL}/api/v1/auth/verify-email?token=${token}`;

//   const html = `<p>Click the link to verify your email:</p>
//                 <a href="${url}">${url}</a>`;

//   await sendEmail(email, "Verify your email", html);
// };

// export const sendVerificationEmailAgent = async (email: string, token: string) => {
//   const url = `${process.env.BASE_URL}/api/v1/agent/verify-email-agent?token=${token}`;

//   const html = `<p>Click the link to verify your email:</p>
//                 <a href="${url}">${url}</a>`;

//   await sendEmail(email, "Verify your email", html);
// };

export const sendVerificationEmailAgent = async (
  email: string,
  token: string,
) => {
  const url = `${process.env.BACKEND_BASE_URL}/api/v1/agent/verify-email-agent?token=${token}`;

  const html = `
    <p>Click the link below to verify your email address. You will be redirected to the sign-in page:</p>
    <a href="${url}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>This link will expire in 1 hour.</p>
  `;

  await sendEmail(email, 'Verify your email', html);
};

