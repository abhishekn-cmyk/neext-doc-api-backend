import nodemailer from "nodemailer";

const sendEmail = async (
  to: string,
  subject: string,
  emailTemplate: string,
  attachments?: { filename: string; path: string }[]
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // needed for port 465
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Next Doc Support" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html: emailTemplate,
      attachments: attachments || [],
    });
  } catch (err) {
    console.error("Email sending failed:", err);
    throw new Error("Failed to send email. Please try again.");
  }
};

export default sendEmail;
