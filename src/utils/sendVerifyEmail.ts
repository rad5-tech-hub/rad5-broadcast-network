
import { sendEmail } from "./sendEmail";

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const url = `${process.env.BASE_URL}/api/v1/auth/verify-email?token=${token}`;

//   const html = `<p>Click the link to verify your email:</p>
//                 <a href="${url}">${url}</a>`;

//   await sendEmail(email, "Verify your email", html);
// };

export const sendVerificationEmailAgent = async (email: string, token: string) => {
  const url = `${process.env.BASE_URL}/api/v1/agent/verify-email-agent?token=${token}`;

  const html = `<p>Click the link to verify your email:</p>
                <a href="${url}">${url}</a>`;

  await sendEmail(email, "Verify your email", html);
};

