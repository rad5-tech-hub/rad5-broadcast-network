import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // service: "gmail",
  // auth: {
  //   user: process.env.EMAIL_USER,
  //   pass: process.env.EMAIL_PASS,
  // },

   host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

/**
 * Sends an email to a recipient.
 * @param to Recipient's email address
 * @param subject Subject of the email
 * @param html HTML content of the email
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"RBN" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
