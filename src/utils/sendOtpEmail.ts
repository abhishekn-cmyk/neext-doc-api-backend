import nodemailer from "nodemailer";

const sendOtpEmail = async (toEmail: string, name: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const emailTemplate = `<div style="font-family: Roboto, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 10px;">
    <div style="text-align: center;">
      <img src="http://next-doc-backend.vual.in/uploads/logo.png" alt="Logo" style="max-width: 120px; margin-bottom: 20px;">
    </div>
    <h2 style="color: #00125c; text-align: center;">Reset Your Password</h2>
    <p style="color: #555555;">Hi <strong>${name}</strong>,</p>
    <p style="color: #555555;">
      We received a request to reset the password for your Next Doc account.
      Use the OTP below to proceed with resetting your password:
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <p style="font-size: 24px; font-weight: bold; color: #00125c; letter-spacing: 4px; background-color: #e6f4f1; padding: 12px 20px; display: inline-block; border-radius: 8px;">${otp}</p>
    </div>
    <p style="color: #555555;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
    <p style="color: #555555;">If you didn’t request a password reset, please ignore this email. Your account is safe.</p>
    <p style="color: #555555;">Thank you,<br>The Next Doc Team</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
    <p style="font-size: 12px; color: #999999; text-align: center;">
      &copy; 2025 Next Doc. All rights reserved.
    </p>
  </div>
`;

  try {
    await transporter.sendMail({
      from: `"Next Doc Support" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Your OTP Code - Next Doc`,
      html: emailTemplate,
    });
  } catch (err) {
    throw new Error("Failed to send OTP email. Please try again.");
  }
};

export default sendOtpEmail;
