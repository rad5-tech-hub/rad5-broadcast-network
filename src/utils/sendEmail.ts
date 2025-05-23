import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
